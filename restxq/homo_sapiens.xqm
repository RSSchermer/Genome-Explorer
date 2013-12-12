(:~
 : Module that exposes human gene data through rest api
 : @author Alexander Wong
 : @author Kim Steenis
 : @author Tinka Bakker
 : @author Roland Schermer
 :)

module namespace GE = 'http://basex.org/modules/web-page';

(:~
 : Returns list of chromosomes.
 :
 : @return JSON response element with list of chromosomes.
 :)
declare
  %output:method("json")
  %rest:path("/genedata/homo_sapiens/chromosomes")
  %rest:GET
  function GE:getChromosomes()
{
  let $db := db:open('homo_sapiens')
  
  let $chromosomes := for $chromosome in $db/genome/chromosome
                      return
                        <chromosome>
                          <id>{$chromosome/@id/data()}</id>
                          <name>Chromosome {$chromosome/@id/data()}</name>
                        </chromosome>
  return
    <json type='object' arrays='results' objects='chromosome'>
      <results>
        {$chromosomes}
      </results>
    </json>
};

(:~
 : Returns list of genes
 :
 : @param $skip         Skips some amount of genes from the start of the result
 : @param $top          Limits the number of elements in the returned list to the 
 :                      amount specified by top
 : @param $chromosomeId If specified it limits the resulting genes to those 
 :                      contained in a chromosome with the given id
 : @param $searchQuery  Query string to be used to return a specific subset of all 
 :                      genes
 :
 : @return JSON response element with a list of genes
 :)
declare
  %output:method("json")
  %rest:path("/genedata/homo_sapiens/genes")
  %rest:GET
  %rest:query-param("skip", "{$skip}", 0)
  %rest:query-param("top", "{$top}")
  %rest:query-param("chromosome", "{$chromosomeId}")
  %rest:query-param("type", "{$geneType}")
  %rest:query-param("search", "{$searchQuery}")
  function GE:getGenes($skip as xs:integer, $top as xs:integer?, $chromosomeId as xs:string?, $geneType as xs:integer?, $searchQuery as xs:string?)
{
  let $db := db:open('homo_sapiens')
  
  (:
   : This should eventually be replaced with proper server side paging
   :)
  let $top := if (not($top) or $top > 500) then
                fn:error(xs:QName('QueryException'),
                  'The query parameter "top" must be specified and smaller than or equal to 100 to save server load, eg: /genes?top=20')
              else
                $top
  
  (:
   : Enforce minimal search query length
   :)
  let $searchQuery := if (not(empty($searchQuery)) and not($searchQuery = '') and string-length($searchQuery) < 4) then
                        fn:error(xs:QName('QueryException'),
                          'If a searchQuery is given it must be atleast 4 characters long.')
                      else
                        $searchQuery

  (:
   : Apply chromosome filter. I tried combining all the filters in one big statement, but
   : that did not affect query execution times at all (basex does some query optimization
   : before executing a query), so applying the filters and result limiting (skip and top)
   : sequentially is ok and improves code readability.
   :)                      
  let $genes := if(not(empty($chromosomeId)) and not($chromosomeId = '')) then
                  ($db/genome/chromosome[@id = $chromosomeId]/gene)
                else
                  ($db/genome//gene)
  
  (:
   : Apply gene type filter.
   :)
  let $genes := if(not(empty($geneType))) then
                  $genes[type/@typeId = $geneType]
                else
                  $genes
  
  (:
   : Apply search query filter.
   :)
  let $tokens := tokenize($searchQuery, '\s')
  let $genes := if(not(empty($searchQuery)) and not($searchQuery = '')) then
                  $genes[GE:contains-all(symbol, $tokens) or GE:contains-all(name, $tokens) or GE:contains-all(locus, $tokens) or GE:contains-all(summary, $tokens)]
                else
                  $genes
  
  (:
   : Count unpaged results.
   :)
  let $count := count($genes)
  
  (:
   : Apply client side paging.
   :)
  let $pagedGenes := if($top) then
                       $genes[position() > $skip and position() <= $skip + $top]
                     else
                       $genes[position() > $skip]
  
  (:
   : Construct result XML.
   :)
  let $entries := for $gene in $pagedGenes
                  where not(empty($gene/symbol))
                  return
                    GE:buildGeneXML($gene)
  
  return
    <json type='object' objects='gene protein' arrays='results'>
      <results>
        {$entries}
      </results>
      <count>{$count}</count>
    </json>
};

(:~
 : Returns data describing a single gene
 :
 : @param $symbol The unique symbol (id) of the gene
 :
 : @return JSON response element describing gene
 :)
declare
  %output:method("json")
  %rest:path("/genedata/homo_sapiens/genes/{$symbol}")
  %rest:GET
  function GE:getGene($symbol as xs:string)
{
  let $db := db:open('homo_sapiens')
  
  let $gene := $db/genome/chromosome/gene[symbol = $symbol]

  return
    <json type='object' objects='results protein'>
      <results>
        {GE:buildGeneXML($gene)/node()}
      </results>
    </json>
};

(:~
 : Returns data describing the exons of a gene
 :
 : @param $symbol The unique symbol (id) of the gene
 :
 : @return JSON response element describing the exons
 :)
declare
  %output:method("json")
  %rest:path("/genedata/homo_sapiens/genes/{$symbol}/exons")
  %rest:GET
  function GE:getGeneExons($symbol as xs:string)
{
  let $db := db:open('homo_sapiens')
  
  let $gene := $db/genome/chromosome/gene[symbol = $symbol]
  
  let $exons := for $exon in $gene/sequence/exons/exon
                return
                  <exon>
                    <product>{$exon/product/text()}</product>
                    <strand>{$exon/strand/text()}</strand>
                    <intervalStart>{$exon/interval_start/text()}</intervalStart>
                    <intervalStop>{$exon/interval_stop/text()}</intervalStop>
                  </exon>
  return
    <json type='object' objects='exon' arrays='results'>
      <results>
        {$exons}
      </results>
    </json>
};

(:~
 : Determines whether all of a set of needle strings are contained in another haystack string.
 :
 : @param $arg           Haystack
 : @param $searchStrings Needles
 :
 : @returns Boolean true if all needles are contained in haystack, false otherwise
 :)
declare function GE:contains-all ($arg as xs:string?, $searchStrings as xs:string*) as xs:boolean 
{
   every $searchString in $searchStrings
   satisfies contains($arg,$searchString)
};

(:~
 : Helper function for constructing the response XML for a certain gene.
 :
 : @param $gene Raw gene element from database.
 :
 : @return Transformed gene element suitable for JSON serialization
 :)
declare function GE:buildGeneXML($gene)
{
  <gene>
    <accessionCode>{$gene/@accession/data()}</accessionCode>
    <symbol>{$gene/symbol/text()}</symbol>
    <chromosomeId>{$gene/ancestor::chromosome/@id/data()}</chromosomeId>
    <locus>{$gene/locus/text()}</locus>
    <name>{$gene/name/text()}</name>
    <type>{$gene/type/text()}</type>
    <updatedAt>{$gene/source_metadata/update_date/day/text()}-{$gene/source_metadata/update_date/month/text()}-{$gene/source_metadata/update_date/year/text()}</updatedAt>
    <protein>
      <name>{$gene/protein/description/text()}</name>
      <description>{$gene/protein/name/text()}</description>
    </protein>
    <description>{$gene/summary/text()}</description>
    <strand>{$gene/sequence/strand/text()}</strand>
    <intervalStart>{$gene/sequence/interval_start/text()}</intervalStart>
    <intervalStop>{$gene/sequence/interval_stop/text()}</intervalStop>
  </gene>
};
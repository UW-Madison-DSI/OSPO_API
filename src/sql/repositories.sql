SELECT rp.url,
       ro.ownername,
       max(rc.last_pushed) AS lastcontrib,
       max(rc.crawl_at) AS lastcrawl
FROM repositories AS rp 
INNER JOIN repositoryowners AS ro ON rp.ownerid = ro.ownerid 
LEFT JOIN repositorycrawls AS rc ON rc.repositoryid = rp.repositoryid
WHERE ro.ownername ILIKE ${owner}
GROUP BY rp.url, ro.ownername
LIMIT 25;
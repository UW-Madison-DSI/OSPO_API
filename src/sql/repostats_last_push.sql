with last_push as materialized (
	SELECT DATE_PART('year', MAX(rc.last_pushed)) AS year,
	       rp.repositoryid,
	       rp.ownerid
	FROM repositories AS rp 
	INNER JOIN repositorycrawls AS rc ON rc.repositoryid = rp.repositoryid
	GROUP BY rp.repositoryid, rp.ownerid
)
SELECT rp.year,
       COUNT(rp.repositoryid) AS repositories,
       NOT (COALESCE(uw.uwrelationid::text, 'Non-UW') = 'Non-UW') AS wisconsin
FROM last_push AS rp
INNER JOIN repositoryowners AS ro ON rp.ownerid = ro.ownerid 
INNER JOIN repositorymanagers AS rm ON rm.managerid = ro.managerid
LEFT JOIN uwrepositories AS uw ON uw.repositoryid = rp.repositoryid
WHERE
    ((${host} IS NULL) OR rm.managername = ${host})
GROUP BY rp.year, NOT (COALESCE(uw.uwrelationid::text, 'Non-UW') = 'Non-UW')
ORDER BY year DESC
LIMIT 25;
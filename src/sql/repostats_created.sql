SELECT DATE_PART('year', rp.created_at) AS year,
       COUNT(rp.repositoryid) AS repositories,
       NOT (COALESCE(uw.uwrelationid::text, 'Non-UW') = 'Non-UW') AS wisconsin
FROM repositories AS rp
INNER JOIN repositoryowners AS ro ON rp.ownerid = ro.ownerid 
INNER JOIN repositorymanagers AS rm ON rm.managerid = ro.managerid
LEFT JOIN uwrepositories AS uw ON uw.repositoryid = rp.repositoryid
WHERE
	rp.created_at IS NOT NULL
GROUP BY DATE_PART('year', rp.created_at), NOT (COALESCE(uw.uwrelationid::text, 'Non-UW') = 'Non-UW')
LIMIT 25;
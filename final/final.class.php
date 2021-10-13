<?php 
class final_rest
{



/**
 * @api  /api/v1/setTemp/
 * @apiName setTemp
 * @apiDescription Add remote temperature measurement
 *
 * @apiParam {string} location
 * @apiParam {String} sensor
 * @apiParam {double} value
 *
 * @apiSuccess {Integer} status
 * @apiSuccess {string} message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *              "status":0,
 *              "message": ""
 *     }
 *
 * @apiError Invalid data types
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {
 *              "status":1,
 *              "message":"Error Message"
 *     }
 *
 */
	public static function setTemp ($location, $date, $low, $high, $forecast)

	{
		if (!is_numeric($low) || !is_numeric($high)) {
			$retData["status"]=1;
			$retData["message"]="'$high' or '$low' is not numeric";
		}
		else {
			try {
				EXEC_SQL("insert into temperature (location, date, DateRequested, Low, High, forecast) values (?,?,CURRENT_TIMESTAMP,?,?,?)",$location, $date, $low, $high, $forecast);
				$retData["status"]=0;
				$retData["message"]="insert of '$forecast' for location: '$location', date '$date', low: '$low', and high: '$high' accepted";
			}
			catch  (Exception $e) {
				$retData["status"]=1;
				$retData["message"]=$e->getMessage();
			}
		}

		return json_encode ($retData);
	}

	public static function getTemp ($date, $sort) {
		try {
			if ($sort == 1) {
				$retData["result"] = GET_SQL("select * from temperature where date=? order by location,dateRequested", $date);
			} else if ($sort == 2) {
				$retData["result"] = GET_SQL("select * from temperature where date=? order by dateRequested,location", $date);
			}/* else {
			$retData["result"] = GET_SQL("select * from temperature where location=? and (date=? Or    ?=' ') order by date,dateRequested",$location, $date, $date);
			$retData["status"]=0;
			//$retData["message"]="forecast is '$forecast' for location: '$location', date '$date', low: '$low', and high: '$high'";
				}*/
		} catch (Exception $e) {
			$retData["status"]=1;
			$retData["message"]=$e->getMessage();
		}
		return json_encode ($retData);
	}
}


var geoip = require('geoip-lite');

exports.getCoordinates = function(req) {
  var ret,
      geo,
      ip = req.ip,
      portIndex = ip.indexOf(":");
      
  if (portIndex != -1) {
    ip = ip.substring(0, portIndex);
  }
       
  geo = geoip.lookup(ip);
  
  if (!geo) {
    ret = { city: "San Francisco", ll: [37.47,-122.13], ip: ip };
  }
  else {
    ret = { city: geo.city, ll: geo.ll, ip: ip };
  }

 return JSON.stringify(ret);
};
						    

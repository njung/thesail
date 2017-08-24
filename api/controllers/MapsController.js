/**
 * MapsController
 *
 * @description :: Server-side logic for managing maps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  provinsi: function (req, res)	{
  	res.view('maps/provinsi')
  },

  // route /render/z/x/y
  data: function (req, res) {
  	const mapnik = require('mapnik')

    // register mapnik font
    if (mapnik.register_default_fonts) mapnik.register_default_fonts()
    if (mapnik.register_system_fonts) mapnik.register_system_fonts()

		// register postgis plugin
    if (mapnik.register_default_input_plugins) mapnik.register_default_input_plugins()

    var param = {
      strictly_simple: true, // false
      simplify_distance: 0.9, // 0.0
      multi_polygon_union: false, // true
      process_all_rings: false // true
    }

    var map = new mapnik.Map(256, 256, '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ')
    map.bufferSize = 64

    var vtile = new mapnik.VectorTile(parseInt(req.params.z), parseInt(req.params.x), parseInt(req.params.y))
    vtile.addGeoJSON(require('fs').readFileSync(sails.config.appPath + '/data-spasial-administrasi-indonesia/provinsi/kemendagri/30_juni_2016.geojson', 'utf8'), 'layer-name', param)

    map.render(vtile, param, function (err, vtile) {
	    if (err) {
	      res.end(err.message)
	    } else {
	      res.writeHead(200, { 'Content-Type': 'application/x-protobuf' })
	      res.end(vtile.getData())
	    }
    })
  }

}


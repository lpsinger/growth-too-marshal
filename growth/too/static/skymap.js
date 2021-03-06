(function($) {

    $.fn.skymap = function(localization, fields) {
        let $svg = this,
            that = this,
             svg = d3.select($svg[0]),
            proj = d3.geoOrthographic().precision(0.1),
            path = d3.geoPath(proj);

        this.redraw = function () {
            svg.selectAll('path').attr('d', path);
        }

        function resize() {
            var width = $svg.width(), height = $svg.height();
            proj.scale(0.5 * width).translate([width / 2, height / 2]);
            that.redraw();
        }

        svg.append('path')
            .datum({type: 'Feature', geometry: d3.geoGraticule10()})
            .attr('class', 'graticule');

        $svg.resize(resize);
        resize();

        d3.geoZoom()
            .projection(proj)
            .onMove(that.redraw)(svg.node());

        this.localization = function(features) {
            // First feature is just the maximum a posteriori position.
            // Recenter the map on this point.
            var center = features.features.shift().geometry.coordinates;
            proj.rotate([-center[0], -center[1]]);

            svg.append('path')
                .datum(features)
                .attr('class', 'contour');

            that.redraw();
        }

        that.redraw();

        /*
        d3.json(localization, function(error, features) {
            if (error) throw error;

            // First feature is just the maximum a posteriori position.
            // Recenter the map on this point.
            var center = features.features.shift().geometry.coordinates;
            proj.rotate([-center[0], -center[1]]);

            svg.append('path')
                .datum(features)
                .attr('class', 'contour');

            redraw();
        });

        d3.json(fields, function(error, feature) {
            if (error) throw error;

            var sel = svg.selectAll('path.field')
                .data(feature.features)
                .enter()
                .append('path')
                .classed('field', true)
                .attr('id', function(d) { return 'f' + d.properties.field_key });

            $(sel.nodes()).tooltip({
                html: true,
                sanitize: false,
                title: function() {
                    var d = d3.select(this).datum();
                    return '<table>'
                        + '<tr>'
                        + '<th style="text-align: left">Field</th>'
                        + '<td style="text-align: right">' + d.properties.field_key + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<th style="text-align: left">RA</th>'
                        + '<td style="text-align: right">'
                        + Math.trunc(d.properties.ra / 15).toString().padStart(2, '0')
                        + '<sup>h</sup>'
                        + Math.trunc(d.properties.ra % 15).toString().padStart(2, '0')
                        + '<sup>m</sup>'
                        + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<th style="text-align: left">Dec</th>'
                        + '<td style="text-align: right">'
                        + (d.properties.dec >= 0 ? '+' : '-')
                        + Math.trunc(Math.abs(d.properties.dec)).toString().padStart(2, '0')
                        + '<sup>d</sup>'
                        + Math.trunc(Math.abs(d.properties.dec) % 1 * 60).toString().padStart(2, '0')
                        + '<sup>m</sup>'
                        + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<th style="text-align: left">References</th>'
                        + '<td style="text-align: right">' + d.properties.reference_filter_bands + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<th style="text-align: left">Limiting magnitudes</th>'
                        + '<td style="text-align: right">' + d.properties.reference_filter_mags + '</td>'
                        + '</tr>'
                        + '</table>';
                }
            });

            redraw();
        });
        */

        return this;
    };

})(jQuery);

import React, { Component } from 'react'
import { Map, TileLayer, Rectangle } from 'react-leaflet'

export class LeafletMap extends Component {


    render() {
        return (
            <div>
                <Map
                    ref={ref => this.mapRef = ref}
                    center={[37.7749, -122.4194]}
                    zoom={13}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    <Rectangle
                        bounds={[[37.781233, -122.454557], [37.760753, -122.428663]]}
                        fillOpacity={0.0}
                        interactive={false}
                    />

                    


                </Map>
            </div>
        )
    }
}

export default LeafletMap
/* [[37.781233, 37.760753], [-122.428663, -122.454557]] */
"use client"
import { MapContainer, TileLayer, Circle, LayerGroup, FeatureGroup, Rectangle, Popup } from 'react-leaflet'
import { LatLngTuple } from 'leaflet';
import "leaflet/dist/leaflet.css"

export default function MapView() {

    const center:LatLngTuple = [51.505, -0.09]
   
    

    const fillBlueOptions = { fillColor: 'blue' }
    const fillRedOptions = { fillColor: 'red' }
    const greenOptions = { color: 'green', fillColor: 'green' }
    const purpleOptions = { color: 'purple' }

    return (
        <MapContainer center={center} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LayerGroup>
                <Circle center={center} pathOptions={fillBlueOptions} radius={200} />
                <Circle
                    center={center}
                    pathOptions={fillRedOptions}
                    radius={100}
                    stroke={false}
                />
                <LayerGroup>
                    <Circle
                        center={[51.51, -0.08]}
                        pathOptions={greenOptions}
                        radius={100}
                    />
                </LayerGroup>
            </LayerGroup>
            <FeatureGroup pathOptions={purpleOptions}>
                <Popup>Popup in FeatureGroup</Popup>
                <Circle center={[51.51, -0.06]} radius={200} />
            </FeatureGroup>
        </MapContainer>
    )
}
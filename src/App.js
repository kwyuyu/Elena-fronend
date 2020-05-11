import React from 'react'
import './App.css'
import './App.scss'
import L from 'leaflet'
import axios from 'axios'
import Header from './layout/Header'
import LeafletMap from './component/LeafletMap'
import SearchBar from './component/SearchBar'
import AlgorithmOptions from './component/AlgorithmOptions'
import SearchButton from './component/SearchButton'
import ElevationGain from './component/ElevationGain'
import Tolerance from './component/Tolerance'
import MultiPathOption from './component/MultiPathOption'
import DraggableMarkerSwitch from './component/DraggableMarkerSwitch'


const domainName = 'http://elenabackend-env.eba-scmatqp8.us-east-1.elasticbeanstalk.com'
/* const domainName = 'http://localhost:5000' */


class App extends React.Component {
  	constructor(props) {
		super(props);
		this.state = {
			source: '',
			sourceCoord: [], // lat, lon
			target: '',
			targetCoord: [], // lat, lon
            algorithm: 'astar',
            elevationGain: 'none',
            tolerance: '',
            number: 1,
            buttonTrigger: false,
            switchTrigger: false,
            findPathLoading: false
        }
        
        this.polylineList = []
        this.sourceMarker = null;
        this.targetMarker = null;
        this.focusPolyline = null;

        this.sourceDragMarker = null
        this.targetDragMarker = null
	}


    // life cycle control
	componentDidMount() {
		this.map = this.leafletMapRef.mapRef
    }
    
    componentDidUpdate(prevProps, prevState) {
        // disable tolerance field when elevationGain is none
        if (prevState.elevationGain !== 'none' && this.state.elevationGain === 'none') {
            this.setState({ tolerance: '' })
        }

        // change to draggable marker
        if (this.state.switchTrigger) {
            if (!this.sourceDragMarker || !this.targetDragMarker) {
                this.onAndOffInputField(true)
                this.removeMarkerPolyline()
                this.addDragMarker()
            }
        }
        else {
            if (this.sourceDragMarker && this.targetDragMarker) {
                this.onAndOffInputField(false)
                this.removeDragMarker()
            }
        }

        // search button triggered
        if (this.state.buttonTrigger) {
            this.findPath()
            this.setState({ buttonTrigger: false })
        }
    }


    // setter
	setSource = (source) => this.setState({ source: source })
	setTarget = (target) => this.setState({ target: target })
	setAlgorithm = (algorithm) => this.setState({ algorithm: algorithm })
	setButtonTrigger = () => this.setState({ buttonTrigger: !this.state.buttonTrigger })
    setElevationGain = (elevationGain) => this.setState({ elevationGain: elevationGain })
    setTolerance = (tolerance) => this.setState({ tolerance: tolerance })
    setNumber = (number) => this.setState({ number: number })
    setSwitchTrigger = () => this.setState({ switchTrigger: !this.state.switchTrigger })


    // draggable marker related functions
    onAndOffInputField = (bool) => {
        this.sourceInput.setState({ disabled: bool })
        this.targetInput.setState({ disabled: bool })
        if (bool) {
            this.sourceInput.resetInputField()
            this.targetInput.resetInputField()
        }
    }

    addDragMarker = () => {
        const sourceCoord = [37.773, -122.445]
        const targetCoord = [37.772, -122.443]

        this.setState({
            sourceCoord: sourceCoord,
            targetCoord: targetCoord
        })

        this.sourceDragMarker = L.marker(sourceCoord, {draggable: true}).addTo(this.map.leafletElement).bindPopup(
            `<Strong>Source:</Strong><br><strong>Longitide: </strong>${sourceCoord[1].toFixed(3)}<br><strong>Latitude: </strong>${sourceCoord[0].toFixed(3)}`
        ).on({
            'drag': (e) => {
                const latlng = e.target.getLatLng();
                e.target.bindPopup(
                    `<Strong>Source:</Strong><br><strong>Longitide: </strong>${latlng.lng.toFixed(3)}<br><strong>Latitude: </strong>${latlng.lat.toFixed(3)}`
                )
                this.setState({ sourceCoord:  [latlng.lat, latlng.lng]})
            },
            'mouseover': () => this.sourceDragMarker.openPopup(),
            'mouseout': () => this.sourceDragMarker.closePopup()
        })

        
        this.targetDragMarker = L.marker(targetCoord, {draggable: true}).addTo(this.map.leafletElement).bindPopup(
            `<Strong>Target:</Strong><br><strong>Longitide: </strong>${targetCoord[1].toFixed(3)}<br><strong>Latitude: </strong>${targetCoord[0].toFixed(3)}`
        ).on({
            'drag': (e) => {
                const latlng = e.target.getLatLng();
                e.target.bindPopup(
                    `<Strong>Target:</Strong><br><strong>Longitide: </strong>${latlng.lng.toFixed(3)}<br><strong>Latitude: </strong>${latlng.lat.toFixed(3)}`
                )
                this.setState({ targetCoord: [latlng.lat, latlng.lng] })
            },
            'mouseover': () => this.targetDragMarker.openPopup(),
            'mouseout': () => this.targetDragMarker.closePopup()
        })

        this.map.leafletElement.fitBounds([sourceCoord, targetCoord])
    }

    removeDragMarker = () => {
        this.sourceDragMarker.remove()
        this.targetDragMarker.remove()
        this.sourceDragMarker = null
        this.targetDragMarker = null
    }




    // url or address encoding
    elenaQueryEncode = (input) => {
        input = input.replace('+', '!-')
        input = input.replace('&', '!,')
        input = input.replace('=', '!<')
        return input
    }

    // url builder
    elenaUrlBuilder = () => {
        if (this.state.switchTrigger) {
            // using longitude and latitude
            const { sourceCoord, targetCoord, algorithm, elevationGain, tolerance, number } = this.state
            let elevationGainMode = elevationGain !== '' ? elevationGain : 'none'
            let toleranceNumber = tolerance === '' ? 100 : parseInt(tolerance)

            return `${domainName}/find_path/${algorithm}?from=${sourceCoord[1]},${sourceCoord[0]}&to=${targetCoord[1]},${targetCoord[0]}&number=${number}&elemode=${elevationGainMode}&tolerance=${toleranceNumber}`
        }
        else {
            // using address
            const { algorithm, elevationGain, tolerance, number } = this.state
            let source = this.elenaQueryEncode(this.state.source)
            let target = this.elenaQueryEncode(this.state.target)
            let elevationGainMode = elevationGain !== '' ? elevationGain : 'none'
            let toleranceNumber = tolerance === '' ? 100 : parseInt(tolerance)

            return `${domainName}/find_path/${algorithm}?fromaddr=${source}&toaddr=${target}&number=${number}&elemode=${elevationGainMode}&tolerance=${toleranceNumber}`
        }
    }

    // if there are multiple polyline, user can click the prefered polyline
    changePath = (e) => {
        let clickedPolyline = e.target
        if (clickedPolyline === this.focusPolyline) {
            return
        }

        clickedPolyline.setStyle({color: '#3388ff'})
        clickedPolyline.bringToFront()
        this.focusPolyline.setStyle({color: 'gray'})
        this.focusPolyline.bringToBack()
        this.focusPolyline = clickedPolyline
    }



    // find path
	findPath = () => {
        if (!this.state.switchTrigger && (this.state.source === '' || this.state.target === '')) {
                alert('Enter source and target address...')
                return
        }
        else {
		    this.draw.bind(this)(this.elenaUrlBuilder(), this.drawCallbackFunc)
        }
    }
    
    // get the result paths
	async draw(url, callbackFunc) {
        let isSucceed = true
        let results = null
		await axios.get(url).then(
            (values) => {
                this.setState({ findPathLoading: true })
                results = values
            }
        ).catch((err) => {
            alert('server is not started or no such address!')
            isSucceed = false
        })
        callbackFunc(results, isSucceed)
	}

    // draw the result paths
	drawCallbackFunc = (results, isSucceed) => {
        if (isSucceed) {
            this.removeMarkerPolyline()

            let resultList = results.data

            if (resultList.legnth === 0) {
                alert('Paths not found!')
            }

            for (var i = 0; i < resultList.length; i++) {
                let resultObject = resultList[i]

                if (i === 0) {
                    if (this.state.switchTrigger) {
                        this.sourceMarker = L.circleMarker(resultObject.sourceCoord, {color: 'green'}).addTo(this.map.leafletElement).bindPopup(
                            `<Strong>Source Point</Strong><br><Strong>Address: </Strong>${resultObject.sourceAddress}`
                        ).on({
                            'mouseover': () => this.sourceMarker.openPopup(),
                            'mouseout': () => this.sourceMarker.closePopup()
                        })

                        this.targetMarker = L.circleMarker(resultObject.targetCoord, {color: 'red'}).addTo(this.map.leafletElement).bindPopup(
                            `<Strong>Target Point</Strong><br><Strong>Address: </Strong>${resultObject.targetAddress}`
                        ).on({
                            'mouseover': () => this.targetMarker.openPopup(),
                            'mouseout': () => this.targetMarker.closePopup()
                        })
                    }
                    else {
                        this.sourceMarker = L.circleMarker(resultObject.sourceCoord, {color: 'green'}).addTo(this.map.leafletElement).bindPopup(
                            `<Strong>Source Point</Strong><br><Strong>Address: </Strong>${resultObject.sourceAddress}`
                        ).on({
                            'mouseover': () => this.sourceMarker.openPopup(),
                            'mouseout': () => this.sourceMarker.closePopup()
                        })
        
                        this.targetMarker = L.circleMarker(resultObject.targetCoord, {color: 'red'}).addTo(this.map.leafletElement).bindPopup(
                            `<Strong>Target Point</Strong><br><Strong>Address: </Strong>${resultObject.targetAddress}`
                        ).on({
                            'mouseover': () => this.targetMarker.openPopup(),
                            'mouseout': () => this.targetMarker.closePopup()
                        })
                    }
                    

                    let polyline = L.polyline(resultObject.positions, {weight: 5}).addTo(this.map.leafletElement).bindPopup(
                        `<Strong>Distance: </Strong>${(resultObject.distance * 0.001).toFixed(3)} km<br><Strong>Elevation: </Strong>${resultObject.elevationAggregate}`
                    ).on({
                        'click': this.changePath,
                        'mouseover': () => polyline.openPopup(),
                        'mouseout': () => polyline.closePopup()
                    })
                    this.focusPolyline = polyline
                    this.polylineList.push(polyline)
                }
                else {
                    let polyline = L.polyline(resultObject.positions, {weight: 5, color: 'gray'}).addTo(this.map.leafletElement).bringToBack().bindPopup(
                        `<Strong>Distance: </Strong>${(resultObject.distance * 0.001).toFixed(3)} km<br><Strong>Elevation: </Strong>${resultObject.elevationAggregate}`
                    ).on({
                        'click': this.changePath,
                        'mouseover': () => polyline.openPopup(),
                        'mouseout': () => polyline.closePopup()
                    })
                    this.polylineList.push(polyline)
                }
            }

            this.map.leafletElement.fitBounds(this.polylineList[0].getBounds())
        }

        this.setState({ findPathLoading: false })
	} 

    // remove the result markers and polylines
    removeMarkerPolyline = () => { 
        if (this.sourceMarker) {
            this.sourceMarker.remove()
            this.sourceMarker = null
        }
        if (this.targetMarker) {
            this.targetMarker.remove()
            this.targetMarker = null
        }
        if (this.polylineList.length !== 0) {
            for (var i = 0; i < this.polylineList.length; i++) {
                this.polylineList[i].remove()
            }
            this.polylineList = []
        }
        
    }
	


  	render() {
    	return (
    		<div>
			    <Header/>
                <DraggableMarkerSwitch
                    setSwitchTrigger={this.setSwitchTrigger}
                />
		    	<LeafletMap
	    			ref={ref => this.leafletMapRef = ref}
    			/>
                <SearchBar 
                    ref={ref => this.sourceInput = ref}
                    placeholder='Enter start address...'
                    setSource={this.setSource}
                    domainName={domainName}
	    		/>
                <SearchBar 
                    ref={ref => this.targetInput = ref}
			    	placeholder='Enter end address...'
                    setSource={this.setTarget}
                    domainName={domainName}
	    		/>
    			<AlgorithmOptions
    				setAlgorithm={this.setAlgorithm}
				/>
                <ElevationGain 
                    setElevationGain={this.setElevationGain}
                />
                <Tolerance 
                    elevationGain={this.state.elevationGain}
                    setTolerance={this.setTolerance}
                    disabled={this.state.elevationGain === 'none' ? true : false}
                />
                <MultiPathOption
                    setNumber={this.setNumber}
                />
                <SearchButton 
                    state={this.state}
                    setTrigger={this.setButtonTrigger}
                    isLoading={this.state.findPathLoading}
			    />
      		</div>
    	);
  	}
}


export default App;

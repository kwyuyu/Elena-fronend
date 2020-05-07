import React, { Component } from 'react'

import Option from 'muicss/lib/react/option';
import Select from 'muicss/lib/react/select';


export class AlgorithmOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            algorithm: 'astar'
        }
    }
    

    onChange = (e) => {
        this.setState({ algorithm: e.target.value })
        this.props.setAlgorithm(e.target.value)
    }

    render() {
        return (
            <form>
                <Select
                    name='algoOption'
                    value={this.state.algorithm}
                    defaultValue='astar'
                    className='algorithm-select'
                    onChange={this.onChange}
                >
                    <Option value='astar' label='AStart'/>
                    <Option value='dijkstra' label='Dijkstra'/>
                </Select>
            </form>
        )
    }
}

export default AlgorithmOptions

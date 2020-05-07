import React, { Component } from 'react'
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import axios from 'axios';



export class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            source: '',
            showSuggestions: false,
            suggestions: [],
            activeSuggestion: 0,

            disabled: false
        }

        
    }

    resetInputField = () => {
        this.setState({ 
            source: '',
            showSuggestions: false,
            suggestions: [],
            activeSuggestion: 0
        })
    }


    async findSuggestions(query) {
        if (!query) {
            return
        }
        var temp_suggestions = []
        await axios.get(`${this.props.domainName}/autocomplete/${query}`).then(
            (response) => {
                
                let values = response.data
                for (var i = 0; i < values.length; i++) {
                    temp_suggestions.push(values[i])
                }
                this.setState({
                    suggestions: temp_suggestions
                })
            }
        ).catch((err) => {
            alert('server is not started or no data!')
            return
        })
    }


    onChange = (e) => {
        this.findSuggestions(e.currentTarget.value)
        this.props.setSource(e.currentTarget.value)
        this.setState({ 
            source: e.currentTarget.value,
            showSuggestions: true,
            activeSuggestion: 0
         })
    }

    onClickOption = (e) => {
        this.props.setSource(e.currentTarget.innerText)
        this.setState({
            suggestions: [],
            showSuggestions: false,
            source: e.currentTarget.innerText,
            activeSuggestion: 0
        })
    }

    onClickResume = (e) => {
        this.findSuggestions(this.state.source)
        this.setState({
            showSuggestions: true,
            activeSuggestion: 0
        })
    }

    onKeyDown = (e) => {
        if (e.keyCode === 13) {
            // enter
            e.preventDefault()
            this.props.setSource(this.state.suggestions[this.state.activeSuggestion])
            this.setState({
                showSuggestions: false,
                source: this.state.suggestions[this.state.activeSuggestion],
                activeSuggestion: 0,
                suggestions: []
            })
        }
        else if (e.keyCode === 38) {
            // up arrow
            if (this.state.activeSuggestion === 0) {
                return ;
            }
            this.setState({ activeSuggestion: this.state.activeSuggestion - 1 })
        }
        else if (e.keyCode === 40) {
            // down arrow
            if (this.state.activeSuggestion + 1 === this.state.suggestions.length) {
                return ;
            }
            this.setState({ activeSuggestion: this.state.activeSuggestion + 1 })
        }
        else if (e.keyCode === 27) {
            // esc
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                suggestions: []
            })
        }
    }


    render() {
        let addressSuggestionsComponent;
        if (this.state.showSuggestions && this.state.source) {
            if (this.state.suggestions.length) {
                addressSuggestionsComponent = (
                    <ul className='suggestions'>
                        {this.state.suggestions.map((addr, index) => {
                            let className;
                            if (index === this.state.activeSuggestion) {
                                className = 'suggestion-active'
                            }
                            return (
                                <li 
                                    className={className} 
                                    key={`${addr},${index}`} 
                                    onClick={this.onClickOption}
                                >
                                    {addr}
                                </li>
                            )
                        })}
                    </ul>
                )
            }
        }

        return (
            <Form className='form'>
                <Input 
                    type='text'
                    name='source'
                    value={this.state.source}
                    placeholder={this.props.placeholder}
                    onChange={this.onChange}
                    onClick={this.onClickResume}
                    onKeyDown={this.onKeyDown}
                    disabled={this.state.disabled}
                />
                {addressSuggestionsComponent}
            </Form>
        )
    }
}

export default SearchBar

    


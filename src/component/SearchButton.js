import React, { Component } from 'react'
import Button from 'muicss/lib/react/button'
import { css } from '@emotion/core'
import { BarLoader } from 'react-spinners'

export class SearchButton extends Component {

    onClick = (e) => {
        this.props.setTrigger()
    }
    
    render() {
        return (
            <div className='search-button-div'>
                <Button 
                    ref={this.buttonRef}
                    variant='raised'
                    color='primary'
                    onClick={this.onClick}
                >
                    Search
                </Button>
                <BarLoader
                    css={css`
                        margin: 0.5%
                    `}
                    color='#36D7B7'
                    loading={this.props.isLoading}
                />
            </div>
        )
    }
}

export default SearchButton

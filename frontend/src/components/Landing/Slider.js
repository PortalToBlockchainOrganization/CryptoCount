import React from 'react'
import styled from 'styled-components'


const sliderThumbStyles = (props) => (`
    width: 25px;
    height: 25px;
    background: ${props.color};
    cursor: pointer;
    outline: 5px solid oragne;
    opacity: ${props.opacity};
    -webkit-transition: .2s;
    transition: opacity .2s 
`)

const Styles = styled.div`
    display: flex;
    align-item: center;
    color: white;
    margin-top:50px;

    .value{
        display: flex;
        margin-top: 50px;
        margin-left: -80px;
        font-size: 2rem;
    }
    .value2{
        display: flex;
        margin-top: 30px;
    }
    .value3{
        display: flex;
        margin-top: 30px;
                flex-direction: column;


    }

    .value4{
        display: flex;
        flex-direction: column;


    }

    .value5{
        display: flex;
        flex-direction: column;

    }

    .slider{
        -webkit-appearance: none;
        width: 500px;
        height: 15px;
        border-radius: 5px;
        background: blue;
        outline: none;

        &::-webkit-slider-thumb{
            -webkit-appearance: none;
            appearance: none;
            ${props => sliderThumbStyles(props)}
        }

        &::-moz-range-thumb{
            ${props => sliderThumbStyles(props)}
        }
    }
`;

export default class Slider extends React.Component{
    state={
        value: 20000
    }

    handleOnChange = (e) => this.setState({value: e.target.value})
    

    render(){
        return(
            <Styles color={this.props.color }>
                 <div className='value4'>{this.state.value}</div>
                 <br></br>
                 <div>
                        <div className='value2'>$0</div>
                        <input type='range' min={500} step={100} max={100000} value={this.state.value} className='slider' onChange={this.handleOnChange}></input>
                        <div className='value3'>$100000</div>
                 </div>
                 <br></br>

                <div className='value5'>{Math.round((this.state.value * .0513)*10)/10}</div>

            </Styles>
        )
    }

}
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import Highcharts from 'react-highcharts/ReactHighstock.src';

class App extends Component {

  constructor () {
    super()
    this.state = {
      startDate: null,
      endDate: null,
      showChart: false,
      data: [],
      loading: false,
      showError: false,
      tooltipOpen: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(date, label) {
    if(label == 'start'){
      this.setState({startDate: date, showChart: false});
    }
    else{
      this.setState({endDate: date, showChart: false});
    }
  }

  handleSubmit(){
    if(this.state.startDate && this.state.endDate){
      moment().format('L');
      axios({
        method:'get',
        url:`http://104.197.128.152/data/adrequests?from=${moment(this.state.startDate._d).format("YYYY-MM-DD")}&to=${moment(this.state.endDate._d).format("YYYY-MM-DD")}`,
      }).then((response)=> {
        if(response.status == 200){
          let { data } = response.data;
          let newArray = [];
          data.map((newData, index)=>{
            newArray.push([new Date(newData.date).getTime(), newData.adrequest]);
          })
          this.setState({showChart: true, data: newArray});
        }else{
          this.setState({showError: true});
        }
      });
    }
  }

  render() {
    var config = {
      rangeSelector: {
        inputEnabled: false
      },
      title: {
        text: 'Ad Requests'
      },
      series: [{
        name: 'adrequests',
        data: this.state.data,
        tooltip: {
          valueDecimals: 2
        }
      }]
    };
    return(
      <div style={{margin: 10, padding: 10}}>
        <div style={{textAlign: 'center'}}>
          <h2>Greedygames Test</h2>
        </div>
        <div style={{display: 'inline-block', marginRight: 100}}>
          <span style={{marginRight: 15}}>From Date</span>
          <div style={{display: 'inline-block'}}>
            <DatePicker
              placeholderText="Select start date"
              selected={this.state.startDate}
              onChange={(date)=>{this.handleChange(date, 'start')}}
              maxDate={this.state.endDate ? moment(this.state.endDate).subtract(1, 'days') : moment()}
              isClearable={true}
            />
          </div>
        </div>
        <div style={{display: 'inline-block', marginRight: 100}}>
          <span style={{marginRight: 15}}>To Date</span>
          <div style={{display: 'inline-block'}}>
            <DatePicker
              placeholderText="Select end date"
              selected={this.state.endDate}
              onChange={(date)=>{this.handleChange(date, 'end')}}
              minDate={this.state.startDate ? moment(this.state.startDate).add(1, "days") : undefined}
              maxDate={moment()}
              isClearable={true}
            />
          </div>
        </div>
        <div style={{display: 'inline-block'}}>
          <button
            onClick={this.handleSubmit}
            disabled={this.state.startDate?this.state.endDate?false:true:true}>
            Submit
          </button>
        </div>
        <div style={{marginTop: 50}}>
          {this.state.showChart && <div>
            <Highcharts config={config}/>
          </div>}
          {this.state.showError && <div style={{textAlign: 'center'}}>
            <h2>Data not available</h2>
          </div>}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('container'));
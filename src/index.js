import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';


// const button = (props) => {
//   return(
//     <div className="button">{props.symbol}</div>
//   );
// }

class App extends React.Component{
  constructor(props){
    super(props)

    //state
    this.state = {
      formula : [],
      display : '0',
      lastInput : 'AC',
    }

    this.buttonHover = this.buttonHover.bind(this);
    this.buttonClicked = this.buttonClicked.bind(this);
    this.equals = this.equals.bind(this);
  }

  buttonHover(e){
    e.target.className = (e.target.className === "grid-item") ? "grid-item-hover" : "grid-item";
  }

  async equals(){
    if(['AC','equals'].includes(this.state.lastInput)){
      return; 
    }
    
    //find number with most decimal places
    const numWithMostDecimalPlaces = this.state.formula.reduce((a,b)=>{
      // find how many places a has after decimal point
      let aLength = 0;
      let bLength = 0;
      a = String(a);
      if(a.includes('.')){
        const sp = a.split('.');
        aLength = sp[1].length;
      }
      if(b.includes('.')){
        const sp = b.split('.');
        bLength = sp[1].length;
      }

      return (aLength > bLength)? a:b;
    });

    //find the length of decimal places in that num
    let decimalPlaces = 2;
    if(numWithMostDecimalPlaces.includes('.')){
      const sp = numWithMostDecimalPlaces.split('.');
      decimalPlaces = sp[1].length;
      
    }

    let significantPlaces = (decimalPlaces > 2)? decimalPlaces : 2;
    
    const expr = this.state.formula.join(' ');
    console.log(expr)
    let answer = eval(expr);
    // find leading 0 of answer so they arnt rounded off
    answer = String(answer);
    let answerSplit = answer.split('.');
    if(answerSplit[0] === '0'){
      //found fraction below 1
      let count = 0;
      answerSplit[1].split('').some((digit)=>{
        count += 1;
        return Number(digit) > 0
      })
      significantPlaces = (count >= significantPlaces) ? count + 1: significantPlaces;
    } 
    const placesFactor = (significantPlaces > 2)? 10**significantPlaces: 10**2; 
    
    const val = Math.floor(answer*placesFactor)/placesFactor;
    await this.setState((previousState)=>{
      return({
        ...previousState,
        formula : [... previousState.formula, '=', val],
        display: val,
        lastInput : 'equals'
      });
    });
  }


  async buttonClicked(e){
    switch(e.target.id){
      case 'AC':
        await this.setState(()=> ({formula: [], display : '0', lastInput: 'AC'}));
        break;
      case 'equals':
        this.equals();
        break;
      case '-':
        if(this.state.formula[this.state.formula.length-1] === '-' && this.state.formula[this.state.formula.length-2] === '-') break;
        this.setState((previousState)=>{
          let form = previousState.lastInput === 'equals' ? [previousState.formula[previousState.formula.length-1]]: [...previousState.formula];
          return({
            ...previousState,
            formula: [...form, e.target.id],
            display: e.target.id,
            lastInput: '-',
          });
        });
        break;
      case '+':
      case '/':
      case '*':
        await this.setState((previousState)=>{
          let form = previousState.lastInput === 'equals' ? [previousState.formula[previousState.formula.length-1]]: [...previousState.formula];
          if(['+','/','-','*'].includes(previousState.lastInput)){
            form[form.length-1] = e.target.id; 
          }else{
            form.push(e.target.id);
          }

          return({
            ...previousState,
            formula: form,
            lastInput: e.target.id,
            display: e.target.id,
          });
        });
        break;
      default:
        const id = (e.target.id === 'zero') ? '0' : e.target.id;
        await this.setState((previousState)=>{
          let val = (['AC', 'equals', '-','*','+','/'].includes(previousState.lastInput) || previousState.display === '0') ? id : previousState.display + id;          
          let form = (['AC', '-','*','+','/'].includes(previousState.lastInput))? [...previousState.formula] : [...previousState.formula.slice(0,-1)];
          form = (previousState.lastInput === 'equals') ? [] : form;
          return({
            ...previousState,
            display: val,
            formula: [...form, val],
            lastInput: id,
          })
        })
    }
  }

  render(){
    return(
      <div id="calc-container">
        <div id="formula">{this.state.formula.join(' ')}</div>
        <div id="display">{this.state.display}</div>
        <div id="calc-body" className="grid-container">
          <div id='AC' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">AC3</div>
          <div id='/' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">/</div>
          <div id='*' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">*</div>
          <div id='7' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">7</div>
          <div id='8' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">8</div>
          <div id='9' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">9</div>
          <div id='-' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">-</div>
          <div id='4' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">4</div>
          <div id='5' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">5</div>
          <div id='6' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">6</div>
          <div id='+' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">+</div>
          <div id='1' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">1</div>
          <div id='2' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">2</div>
          <div id='3' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">3</div>
          <div id='equals' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">=</div>
          <div id='zero' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">0</div>
          <div id='.' onClick={this.buttonClicked} onMouseOver={this.buttonHover} onMouseLeave={this.buttonHover} className="grid-item">.</div>
        </div>
      </div>

    );
  }
}




ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

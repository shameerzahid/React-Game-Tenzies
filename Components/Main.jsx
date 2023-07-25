import React from 'react'
import Die from './Die'
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'

export default function Main() {
    const [dice, setDice] = React.useState(AllNewDice())
    const [Tenzies, setTenzies] = React.useState(false)
    const [rollCount, setRollCount] = React.useState(0)
    const [lose, setlose] = React.useState(false)
    const [maxScore, setMaxScore] = React.useState(0)
    React.useEffect(() =>
    {
        const allHeld = dice.every(dice => dice.isHeld === true)
        const firstvalue = dice[0].value
        const allSame = dice.every(dice => firstvalue === dice.value)
        if(allHeld && allSame)
        {
            setTenzies(true)
            console.log("You won")
        } else if(allHeld === true && allSame === false)
        {
            setlose(true)
        }
    }, [dice])
    React.useEffect(() =>
    {
       if(maxScore === 0)
       {
           localStorage.setItem('maxCount', JSON.stringify(rollCount));
           setMaxScore(rollCount)
       }
       else
       {
            if(rollCount < localStorage.getItem('maxCount') && rollCount >0)
           {
               localStorage.setItem('maxCount', JSON.stringify(rollCount))
           }
       }
      
    }, [Tenzies]

    )

    const diceElement = dice.map(dice => <Die key={dice.id} value ={dice.value} isHeld={dice.isHeld}HoldDice={() => HoldDice(dice.id)} /> )
    function HoldDice(id)
    {
        setDice(olddice => olddice.map(die =>
            {
               return  id === die.id ?
                {...die, isHeld : !die.isHeld} :
                die
            }
            ))
    }
    function AllNewDice()
    {
        
        const newDice = []
        for( let i=0;i<10;i++)
        {
            newDice[i] = {value: Math.ceil(Math.random() * 6), isHeld: false, id: nanoid()}

        }
       return newDice
    }
    function rollDice()
    {
    setRollCount(oldcount => oldcount + 1)
    setDice(olddice => olddice.map(dice => {
            return dice.isHeld ?  dice : {value: Math.ceil(Math.random() * 6), isHeld: false, id: nanoid()} 
        } ))
    }
    function NewGame()
    {
        setRollCount(0)
        setDice(AllNewDice)
        setTenzies(false)
        setlose(false)
    }


    

  return (
    <div className="main">
        {
            Tenzies && <Confetti
          />
        }
        <h2 className='low-roll'>Lowest Rolls: {localStorage.getItem("maxCount")} </h2>
        <h1 className="heading">Tenzies</h1>
        <p className="para">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="dice-container">
          {diceElement}
        </div>
        {
            Tenzies || lose ? <button className="roll-dice" onClick={NewGame}>New Game</button>
            :
            <button className="roll-dice" onClick={rollDice}>Roll</button>
        }
        {Tenzies && <h1>You Rolled {rollCount} times</h1> }
        {lose && <h1>You lose! Please Try Again! </h1> }
        
   
   </div>
  )
}

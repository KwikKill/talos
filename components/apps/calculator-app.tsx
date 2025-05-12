"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function CalculatorApp() {
  const [display, setDisplay] = useState("0")
  const [firstOperand, setFirstOperand] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit)
      setWaitingForSecondOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.")
      setWaitingForSecondOperand(false)
      return
    }

    if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const clearDisplay = () => {
    setDisplay("0")
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  const handleOperator = (nextOperator: string) => {
    const inputValue = Number.parseFloat(display)

    if (firstOperand === null) {
      setFirstOperand(inputValue)
    } else if (operator) {
      const result = performCalculation()
      setDisplay(String(result))
      setFirstOperand(result)
    }

    setWaitingForSecondOperand(true)
    setOperator(nextOperator)
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (operator === "+") {
      return firstOperand! + inputValue
    } else if (operator === "-") {
      return firstOperand! - inputValue
    } else if (operator === "*") {
      return firstOperand! * inputValue
    } else if (operator === "/") {
      return firstOperand! / inputValue
    }

    return inputValue
  }

  const handleEquals = () => {
    if (!operator || firstOperand === null) return

    const result = performCalculation()
    setDisplay(String(result))
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  return (
    <div className="flex h-full flex-col bg-background text-foreground p-2">
      <div className="mb-2 flex flex-col h-12 items-end justify-center rounded bg-muted p-2 text-right text-2xl">
        <p className="text-sm text-muted-foreground">
          {firstOperand !== null ? firstOperand : ""} {operator ? operator : ""}
        </p>
        <p>{display}</p>
      </div>
      <div className="grid flex-1 grid-cols-4 gap-1">
        <Button variant="outline" onClick={clearDisplay}>
          C
        </Button>
        <Button
          variant="outline"
          onClick={() => setDisplay(display.charAt(0) === "-" ? display.substring(1) : "-" + display)}
        >
          +/-
        </Button>
        <Button variant="outline" onClick={() => setDisplay(String(Number.parseFloat(display) / 100))}>
          %
        </Button>
        <Button variant="outline" className="bg-orange-100 dark:bg-orange-900" onClick={() => handleOperator("/")}>
          /
        </Button>

        <Button variant="outline" onClick={() => inputDigit("7")}>
          7
        </Button>
        <Button variant="outline" onClick={() => inputDigit("8")}>
          8
        </Button>
        <Button variant="outline" onClick={() => inputDigit("9")}>
          9
        </Button>
        <Button variant="outline" className="bg-orange-100 dark:bg-orange-900" onClick={() => handleOperator("*")}>
          ×
        </Button>

        <Button variant="outline" onClick={() => inputDigit("4")}>
          4
        </Button>
        <Button variant="outline" onClick={() => inputDigit("5")}>
          5
        </Button>
        <Button variant="outline" onClick={() => inputDigit("6")}>
          6
        </Button>
        <Button variant="outline" className="bg-orange-100 dark:bg-orange-900" onClick={() => handleOperator("-")}>
          -
        </Button>

        <Button variant="outline" onClick={() => inputDigit("1")}>
          1
        </Button>
        <Button variant="outline" onClick={() => inputDigit("2")}>
          2
        </Button>
        <Button variant="outline" onClick={() => inputDigit("3")}>
          3
        </Button>
        <Button variant="outline" className="bg-orange-100 dark:bg-orange-900" onClick={() => handleOperator("+")}>
          +
        </Button>

        <Button variant="outline" className="col-span-2" onClick={() => inputDigit("0")}>
          0
        </Button>
        <Button variant="outline" onClick={inputDecimal}>
          .
        </Button>
        <Button variant="outline" className="bg-orange-200 dark:bg-orange-800" onClick={handleEquals}>
          =
        </Button>
      </div>
    </div>
  )
}

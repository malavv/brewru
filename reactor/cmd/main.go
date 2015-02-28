// Copyright 2015 Maxime Lavigne
// Use of this source code is governed by a private license available in LICENSE.md

package main

import (
	"flag"
	"fmt"
	"os"
)

var (
	globalRepl = NewRepl([]*action{
		NewAction("exit", "Exits the software", exitFnc),
		NewAction("help", "Lists available commands", nil),
		NewAction("status", "Summary information of the current.", statusFnc),
		NewAction("step", "List, add, remove and change current step.", stepFnc),
	})

	current *recipe
)

type fnc struct {
	keyword     string
	description string
	action      func([]string)
}

func addFake() {
	if initial, found := current.GetStepByName("initial"); found {
		initial.AddNextStep(NewStep("Bring to a boil", "t", "100", "C"))
	}

	if initial, found := current.GetStepByName("B"); found {
		initial.AddNextStep(NewStep("C", "t", "100", "C"))
		initial.AddNextStep(NewStep("E", "t", "100", "C"))
	}

	if initial, found := current.GetStepByName("C"); found {
		initial.AddNextStep(NewStep("D", "t", "100", "C"))
	}
}

func main() {
	// Functions refering back to the repl. In order to break dep. loop.
	if action, found := globalRepl.GetAction("help"); found {
		action.fnc = helpFnc
	}

	current = NewRecipe("Unnamed Recipe")
	globalRepl.SetMode(current.initial.name)

	addFake()

	flag.Parse()

	fmt.Println("        --- Brewru Reactor ---")
	fmt.Println("This is an interactive session to the reactor.")
	fmt.Println("Available commands :")
	globalRepl.PrintUsage()

	globalRepl.loop()
}

func exitFnc(cmd []string) {
	os.Exit(0)
}
func helpFnc(cmd []string) {
	globalRepl.PrintUsage()
}
func statusFnc(cmd []string) {
	current.Dashboard()
}
func stepFnc(param []string) {
	if len(param) >= 1 {
		if param[0] == "list" {
			current.ListAllSteps()
		}
	}
}

// -- REPL --
//  initial> status
//    == Unamed Recipe ==
//      # of steps : 2
//  initial> list
//    0:initial(none)
//    1:Bring to a boil(tempReached)
//    2:Boiling(timeElapsed)
//    3:Cooling(tempReached)
//    4:Filtrating(?)
//    5:Adding air(?)
//    6:Adding yeast(yeastAdded)
//    7:1st fermentation(timeReached (if yeast caught?))
//    8:Siphoning to tourie(?)
//    9:2nd Fermentation(timeReach or FG)
//   10:Bottling

//  Outside recipe.
// create Teleporter
//  Recipe Teleporter started.
//  Currently no ingredients and [initial] step.
// ingredients add tapWater symbolic
//   Ingredient tapWater(x Litres) added to initial step.
// steps add bringToBoil --from initial --untilParam temperature 100C
//   initial -> bringToBoil(temperature:100C)

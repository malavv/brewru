// Copyright 2015 Maxime Lavigne
// Use of this source code is governed by a private license available in LICENSE.md

package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"strings"
)

var (
	globalFnc = map[string]func([]string){
		"exit":   exitFnc,
		"help":   helpFnc,
		"status": statusFnc,
		"step":   stepFnc,
	}
	current *recipe
)

func main() {
	current = NewRecipe("Unnamed Recipe")

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

	flag.Parse()
	menu()
	repl()
}

func menu() {
	fmt.Println("        --- Brewru Reactor ---")
	fmt.Println("This is an interactive session to the reactor.")
	fmt.Println("Available commands :")
	helpFnc(nil)
}

func handleGlobalCmd(cmds []string) {
	fmt.Printf("Recognized and will handle cmd : %s\n", cmds)
}
func globalUsage() {
	fmt.Println("    exit   Exits the software")
	fmt.Println("    help   Lists available commands")
	fmt.Println("    step   Step utilities")
	fmt.Println("    status Summary information of the current.")
}
func exitFnc(cmd []string) {
	os.Exit(0)
}
func helpFnc(cmd []string) {
	globalUsage()
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

func repl() {
	scanner := bufio.NewScanner(os.Stdin)
	fmt.Print("> ")
	for scanner.Scan() {
		tokens := strings.Split(strings.ToLower(scanner.Text()), " ")
		if _, found := globalFnc[tokens[0]]; found {
			globalFnc[tokens[0]](tokens[1:])
		} else {
			fmt.Printf("Unrecognized function %s\n", tokens[0])
			globalUsage()
		}
		fmt.Print("> ")
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

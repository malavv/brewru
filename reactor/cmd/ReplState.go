// Copyright 2015 Maxime Lavigne
// Use of this source code is governed by a private license available in LICENSE.md

package main

import (
	"fmt"
)

type replState struct {
	actions        []*action
	actionKeywords map[string]*action
}

type action struct {
	keyword string
	usage   string
	fnc     func([]string)
}

func NewReplState() *replState {
	return &replState{
		actions:        make([]*action, 10),
		actionKeywords: make(map[string]*action),
	}
}

func NewAction(keyword, usage string, fnc func([]string)) *action {
	return &action{
		keyword: keyword,
		usage:   usage,
		fnc:     fnc,
	}
}

func (repl *replState) Add(action *action) *replState {
	repl.actions = append(repl.actions, action)
	repl.actionKeywords[action.keyword] = action
	return repl
}

func (repl *replState) PrintUsage() {
	fmt.Println("testUsage")
}

func (repl *replState) GetAction(keyword string) (*action, bool) {
	return nil, false
}

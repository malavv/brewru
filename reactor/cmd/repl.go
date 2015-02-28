// Copyright 2015 Maxime Lavigne
// Use of this source code is governed by a private license available in LICENSE.md

package main

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strings"
)

type repl struct {
	actions        []*action
	keyword2action map[string]*action
	mode           string
}

func NewRepl(actions []*action) *repl {
	sort.Sort(ByKeyword(actions))

	k2a := make(map[string]*action, len(actions))
	for _, v := range actions {
		k2a[v.keyword] = v
	}

	return &repl{
		actions:        actions,
		keyword2action: k2a,
	}
}

func (r *repl) loop() {
	scanner := bufio.NewScanner(os.Stdin)
	fmt.Printf("%s> ", r.mode)
	for scanner.Scan() {
		tokens := strings.Split(strings.ToLower(scanner.Text()), " ")
		if action, found := r.keyword2action[tokens[0]]; found {
			action.fnc(tokens[1:])
		} else {
			fmt.Printf("Unrecognized function %s\n", tokens[0])
			r.PrintUsage()
		}
		fmt.Printf("%s> ", r.mode)
	}
}

func (r *repl) PrintUsage() {
	for _, v := range r.actions {
		fmt.Printf("  %-8s: %s\n", v.keyword, v.usage)
	}
}

func (r *repl) GetAction(keyword string) (*action, bool) {
	a, ok := r.keyword2action[keyword]
	return a, ok
}
func (r *repl) SetMode(mode string) {
	r.mode = mode
}

type ByKeyword []*action

func (k ByKeyword) Len() int           { return len(k) }
func (k ByKeyword) Swap(i, j int)      { k[i], k[j] = k[j], k[i] }
func (k ByKeyword) Less(i, j int) bool { return k[i].keyword < k[j].keyword }

// Copyright 2015 Maxime Lavigne
// Use of this source code is governed by a private license available in LICENSE.md

package main

import (
	"fmt"
)

var (
	stepIdx = 0
)

type recipe struct {
	initial        *step
	name           string
	cacheStepsName map[string]*step
}

type step struct {
	id     int
	name   string
	until  *untilParam
	nexts  []*step
	parent *recipe
}

type untilParam struct {
	param string
	value string
	unit  string
}

func NewRecipe(name string) *recipe {
	initial := &step{
		name:  "initial",
		until: nil,
		nexts: []*step{},
	}
	recipe := &recipe{
		initial: initial,
		name:    name,
		cacheStepsName: map[string]*step{
			"initial": initial,
		},
	}
	initial.parent = recipe
	return recipe
}

func NewStep(name, param, value, unit string) *step {
	stepIdx += 1
	return &step{
		id:   stepIdx,
		name: name,
		until: &untilParam{
			param: param,
			value: value,
			unit:  unit,
		},
		nexts:  []*step{},
		parent: nil,
	}
}

func (r recipe) GetStepByName(name string) (*step, bool) {
	if step, found := r.cacheStepsName[name]; found {
		return step, true
	}
	return nil, false
}

func (next step) AddNextStep(s *step) {
	s.parent = next.parent
	s.parent.cacheStepsName[s.name] = s
	next.nexts = append(next.nexts, s)
}

func (s step) String() string {
	if s.until == nil {
		return fmt.Sprintf("%d:%s(inf)", s.id, s.name)
	}
	return fmt.Sprintf("%d:%s(%s:%s%s)", s.id, s.name, s.until.param, s.until.value, s.until.unit)
}

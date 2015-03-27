// Copyright 2015 Maxime Lavigne
// Use of this source code is governed by a private license available in LICENSE.md

package main

import (
	"fmt"
)

func (r *recipe) Dashboard() {
	fmt.Printf("== %s ==\n", r.name)
	fmt.Printf("  # of steps : %d\n", len(r.cacheStepsName))
}

func (r *recipe) ListAllSteps() {
	for _, v := range r.cacheStepsName {
		fmt.Printf("    %s\n", v)
	}
}

func (s *step) Print() bool {
	if s.until == nil {
		fmt.Printf("%s(inf)", s.name)
	} else {
		fmt.Printf("%s(%s:%s%s)", s.name, s.until.param, s.until.value, s.until.unit)
	}

	return len(s.nexts) > 0
}

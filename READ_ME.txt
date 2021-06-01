INSTANCE OF STABLE MATCHING PROBLEM
Assume you have two sets, A and B, where each set has n members. We need to match every
member in A with exactly one member of B and vice versa.
Preferences: Every member of each set ranks all members of the other set by preference, in an
array (the first preference at index 0, the least preferred partner at index n-1).
For this assignment, we match companies with candidates. Each company has a ranking of all
candidates, in order of preference. Each candidate has a ranking of all companies. A
programmer has implemented a program that generates a matching: n pairs, each with a unique
company and candidate.
Stable matching. The program’s generated “hires” are stable if there do not exist two matched
pairs, where a company from one pair and a candidate from the other pair both prefer each
other to their current match (the preferences of their current partners don’t matter).

APPLICATIONS
There are many problems of this nature. Consider assigning TAs to classes; matching residents
with hospitals; pairing students for homework; and much more. Some of these problems are
variation on the theme (maybe the companies don’t rank every candidate, or are allowed to give
some of them the same rank; maybe you only have partial information for making the
assignment; etc.). Ultimately, however, this problem in its many guises has wide application.

WHY
writing code that we think is right is not good enough for anyone to be confident that 
our software is correct. Any software that is useful tends to be complex, and testing
the correctness most of the time cant be proved by hand or automatically in a reasonable
amount of time. Thus we have automated testing.
Before we assume two things in our test, that there is only one right answer, and that there 
is an easy way to find it.

INPUT-OUTPUT SPECIFICATION
The preferences of a candidate are represented as an array of N distinct numbers from 0 to N - 1.
For example, if a candidate’s preferences are the array [2, 0, 1], that means that that candidate’s
most preferred company is company 2 and least preferred company is company 1. A company’s
preferences are represented in the same way, but ranking candidates instead. All these are
grouped into one array of company preferences, and one array of candidate preferences.
We have added the following functions to Ocelot that you can use in this assignment:
wheat1(companies: number[][], candidates: number[][]): Hire[]
chaff1(companies: number[][], candidates: number[][]): Hire[]
Type Hire denotes an object with two fields: { company: number, candidate: number }
Both functions wheat1 and chaff1 take as arguments preference arrays and return solutions to
the stable matching problem. However, chaff1 has bugs, whereas wheat1 gives a correct
solution. The number N of companies and candidates must be the same. companies[i] is the
preference array of company i (an array of N candidate numbers, in preference order) and
candidates[j] is the preference array of candidate j.
The result of both wheat1 and chaff1 are an array of N Hire objects, where each object
matches a company with a candidate. The returned array of hires is not in any particular order.
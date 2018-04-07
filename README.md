# TRAINS-and-TOWNS-task
This code is in pure event driven architecture without Promise and Async/Await. 
Algorithm calculates 
- distance through route 
- different routes count by
  - graph 
  - route 
  - [max distance, max stops]

## Getting Started
### Algorithm introduction
This algorithm starts to find route between start and end points from both edges and continues until this edges meets. while edges is in searching for path they both calculates moving distance and steps separately. 
while moving if some finded path will not match with max length or max stops conditions then they will not include for next search.
and finally when they meets in one or more points last time checks conditions and they saving.
this process will continue until one of sides can not to move because condition filteres them. after that process returns saved paths which is different routes between start and end points.

### Input params example
```
'AL5, LC4, CW8, WC8, WG6, AW5, CG2, GL3, AG7' C-W-G-L [ max length max stops]
```
or
```
AL5,LC4,CW8,WC8,WG6,AW5,CG2,GL3,AG7 C-W-G-L [ max length max stops]
```
first param is graph, secod is route. max length and max stops is optional params, if they are not declared then 
by default max length = 30, max stops = 7
 

### Output
```
Distance:  17
Different routes count: 3
```


### Running in terminal
```shell
cd appFolder
node TT.js [graph] [route] [maxLength maxStops]
```
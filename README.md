# TRAINS-and-TOWNS-task
I wrote this algorithm in pure event driven architecture without Promise and Async/Await. Algorithm inputs: graph, 
route [ , max distance, max stops ] and calculates 
- distance through route 
- different routes count which is less than max distance and through route stops is no more than max stops

## Getting Started
### Algorithm introduction
this algorithm starts to find route between start and end points from both edges and continues until this edges meets. while edges is in searching for path they both calculates moving distance and steps separately. 
while moving if some finded path will not match with max length or max stops conditions then they will not include for next search.
and finally when they meets in one or more points last time checks conditions and they saving.
this process will continue until one of sides can not to move because condition filteres them. after that process returns saved paths which is different routes between start and end points.

### Running in terminal
```shell
cd appFolder
node TT.js [graph] [route] [maxLength maxStops]
```

maxLength and maxStops is optional inputs, by default maxLength = 30, maxStops = 7



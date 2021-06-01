//@Alan Castillo
//Automated Testing Oracle for solution for Stable Matching Problem

/*Helper function*/
// Returns a random int i where min <= i < max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//Fisher-Yates Shuffle to create random permutation
function shuffle(twoDimArr) {
  for (let i = twoDimArr.length-1; i >= 0; --i) {
    //shuffle objects preference list
    for(let k = twoDimArr.length-1; k >= 0; --k) {
      let h = randomInt(0,k+1);
      let tmp = twoDimArr[i][k];
      twoDimArr[i][k] = twoDimArr[i][h];
      twoDimArr[i][h] = tmp;
    }
    //shuffle objects
    let j = randomInt(0,i+1);
    let tmp = twoDimArr[i];
    twoDimArr[i] = twoDimArr[j];
    twoDimArr[j] = tmp;
  }
  return twoDimArr;
}

//generateInput(n: number): number[][]
function generateInput(n){
  //start 2D array of objects and respective preference list
  let objArrAndPref = [];
  //initialization of array
  for (let x=n-1; x>=0; --x) {
    let prefList = [];
    for (let y=n-1; y>=0; --y) {
      prefList.push(y);
    }
    objArrAndPref.push(prefList);
  }  
  return shuffle(objArrAndPref);
}

//oracle(f: (companies: number[][], candidates: numer[][]) => Hire[]): void
function oracle(f) {
  //we know that f is either going to be wheat1(correct) or chaff1(incorrect) and return a stable matching
  let numTests = 1;
  for (let i = 0; i < numTests; ++i) {
    for (let n=1; n<2; ++n) {
      let companies = generateInput(n);
      let candidates = generateInput(n);
      let hires = f(companies, candidates);
      test('Hires length is correct', function() {
        assert(n === hires.length);
      });
      test('Test hires are stable', function() {
        for(let a=0; a<hires.length; ++a) {
          let curCompany = hires[a].company;
          let matchedCandidate = hires[a].candidate;
          let curCompanyPrefList = companies[curCompany];
          for(let b=0; b<curCompanyPrefList.indexOf(matchedCandidate); ++b) {
            let prefCandidate = curCompanyPrefList[b];
            let matchedCompanyOfPrefCand = undefined;
            for(let c=0; c < hires.length; ++c) {
              if(hires[c].candidate === prefCandidate) {
                matchedCompanyOfPrefCand = hires[c].company;
              }
            }
            let prefCandidatePrefList = candidates[prefCandidate];
            for(let c=0; c<prefCandidatePrefList.indexOf(matchedCompanyOfPrefCand); ++c) {
              if(prefCandidatePrefList[c] === curCompany) {
                assert(false);
              }
            }
          }
        }
        assert(true);
      });
    }
  }
}
//oracle(wheat1);

/*
You will have to figure out all properties that make a solution (in)correct and implement tests for all of them.
However, even if an implementation is incorrect, it may sometimes produce a correct solution.
This is fine, your only requirement is to correctly classify each solution as right or wrong.
To do well, you should carefully consider all the different ways in which the output could be either invalid for 
the original problem statement. You may assume the output is of the right type, Hire[], but nothing else.
*/


/*
Algorithm: We assume the following non-standard variant: At any step, any unmatched
company or candidate may propose. Every party always proposes to the next potential partner
on their preference list, starting with the top choice. Proposals are not repeated. Any unmatched
party that receives a proposal accepts unconditionally. If the receiving party is already matched,
but they receive a better offer (higher in their preference list), they accept, and their current
partner becomes unmatched; otherwise, the offer is rejected. The algorithm ends when all
parties are either matched or have made offers to the entire preference list. The algorithm is
underspecified/nondeterministic: it doesn’t state whether a company or a candidate proposes
at a given step, nor which one does, as long as the given rules are observed.

It should check that
1) the offer sequence in the trace is valid, made according to the given algorithm, starting with
all parties unmatched. The trace need not be a complete algorithm run, it may stop at any point.
2) the produced matching (out) is indeed the result of the offers in the trace.

You should not test whether the resulting matching is complete nor stable. You need to check the
constraints at 1) and 2) above. To do this, you might need to “simulate” the effects of the offers
in the trace, keeping track of the matchings at every step.

*/
//runOracle(f: (companies: number[][], candidates: number[][]) => Run): void
function runOracle(f) {
  //we know that f is either going to be wheat1(correct) or chaff1(incorrect) and return a stable matching
  let numTests = 3;
  for (let i = 0; i < numTests; ++i) {
    for (let n=1; n<20; ++n) {
      let companies = generateInput(n);
      let candidates = generateInput(n);
      let Run = f(companies, candidates);
      test('Test Offer Trace is Valid', function() {
        let matchedCompanies = [];
        let matchedCandidates = [];
        for (let i = 0; i < n; ++i) {
          matchedCompanies.push({matched: false, partner: undefined});
          matchedCandidates.push({matched: false, partner: undefined});
        }    
        for(let OfferIndex = 0; OfferIndex < Run.trace.length; ++OfferIndex){
          let proposer = Run.trace[OfferIndex].from;
          let reciever = Run.trace[OfferIndex].to;
          let proposerPrefList = undefined;
          let recieversPrefList = undefined;
          let matchingProposersArr = undefined;
          let matchingRecieversArr = undefined;
          if (Run.trace[OfferIndex].fromCo === false) {
            matchingProposersArr = matchedCandidates;
            matchingRecieversArr = matchedCompanies;
            proposerPrefList = candidates[proposer];
            recieversPrefList = companies[reciever];
          } else {
            matchingProposersArr = matchedCompanies;
            matchingRecieversArr = matchedCandidates;
            proposerPrefList = companies[proposer];
            recieversPrefList = candidates[reciever]
          }
          
          //check if proposer is already matched
          if (matchingProposersArr[proposer].matched === true) {
            assert(false);
          }
          
          //check if reciever is in order of preference
          for(let prefPartnerIndex = 0; prefPartnerIndex < proposerPrefList.indexOf(reciever); ++prefPartnerIndex) {
            let curPrefReciever = proposerPrefList[prefPartnerIndex];
            let result = false;
            for (let OfferIndex2 = 0; OfferIndex2 < OfferIndex; ++OfferIndex2){
              if ((Run.trace[OfferIndex2].from === proposer) && (Run.trace[OfferIndex2].fromCo === Run.trace[OfferIndex].fromCo)) {
                if (curPrefReciever === Run.trace[OfferIndex2].to) {
                  result = true;
                }
              }
            }
            if (result === false) {
              assert(false);
            }
          }
          //check if repeated proposal
          for (let j = 0; j < OfferIndex; ++j) {
            if ((proposer === Run.trace[j].from) && (Run.trace[j].fromCo === Run.trace[OfferIndex].fromCo) && (reciever === Run.trace[j].to)) {
              assert(false);
            }
          }
          //check if reciever is unmatched
          if(matchingRecieversArr[reciever].matched === false) {
            matchingRecieversArr[reciever].matched = true;
            matchingRecieversArr[reciever].partner = proposer;
            matchingProposersArr[proposer].matched = true;
            matchingProposersArr[proposer].partner = reciever;
          } else {
            //check if proposer is preferred
            let origMatch = matchingRecieversArr[reciever].partner;
            if (recieversPrefList.indexOf(proposer) < recieversPrefList.indexOf(origMatch)) {
              matchingProposersArr[proposer].matched = true;
              matchingProposersArr[proposer].partner = reciever;
              matchingRecieversArr[reciever].partner = proposer;
              //unmatch the original proposer
              matchingProposersArr[origMatch].matched = false;
              matchingProposersArr[origMatch].partner = undefined;
            }
          }
        }

        //check the output hires result from offers trace
        for (let i=0; i < Run.out.length; ++i) {
          if (matchedCompanies[Run.out[i].company].partner !== Run.out[i].candidate) {
            assert(false);  
          }
        }
        assert(true);
      });
    }
  }
}

const oracleLib = require('oracle');
//runOracle(oracleLib.traceWheat1);
//runOracle(oracleLib.traceChaff1);

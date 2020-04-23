# pillsIntakeCalculator

To run a project after cloning you need to follow this steps:
1. npm install
2. npm install -g ts-node - If you don't have it, or
npm install -D ts-node - if you don't ant ot global
3. ts-node src/main.ts
(I assume you have node already installed)

ALGORITHM

Well, for starter I think that function calculateIntakeEndDate(intakes, stock, frequencies weekDays)
has a bit overloaded interface. In addition it has optional argument weekDays.
But wait, it's not really optional if we have selected 'weekly' frequency.

1. I decided to always work with weekDays. In order to achiev that I made a funtion that returns(consider it is a monday today):
{ monday: true, tuesday: false, wednesday: true, thursday: false, friday: true, saturday: false, sunday: true } - for the 'eachOtherDay' freqeuncy and 
{ monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true } - for the 'daily'

Now I need one function that will calculate date for all of the frequency options.

2. Calculation algorithm goes like that:

-> decide whether or not we subtracting pills from stock for the first day

-> make action depending on the previous step (subtract or just pass value further

-> calculate how many pills goes for a day

-> keep subtracting that amount from stock, untill you have nothing left, whike counting every time you subtracted pills

-> take counted value and create a new date + counted value

->
end

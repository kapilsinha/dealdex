# Moralis backend

The new and shiny. Replaces Firebase stuff

## Cloud Functions
### DealCreatedHandler
1. Copy data from pending deal (lookup via txnHash) to new deal object
2. Update creator's pendingDealsCreated, project's dealsWhereProject, manager's dealsWhereManager
3. Delete old pending deal object
4. Add a new watchContractEvent cloud function for this new deal address

### InvestUpdateHandler
1. Update totalFunds on deal object
2. Update nft object with investedAmt

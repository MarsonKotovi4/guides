import {
  ERC20Contract_Approval_loader,
  ERC20Contract_Approval_handler,
  ERC20Contract_Transfer_loader,
  ERC20Contract_Transfer_handler,
} from "../generated/src/Handlers.gen";

import { AccountEntity, ApprovalEntity } from "../generated/src/Types.gen";

ERC20Contract_Approval_loader(({ event, context }) => {
  // Loading the Account entity for the owner
  context.Account.load(event.params.owner.toString());
});

ERC20Contract_Approval_handler(({ event, context }) => {
  // Getting the owner Account entity
  let ownerAccount = context.Account.get(event.params.owner.toString());

  if (!ownerAccount) {
    // Creating the account if it doesn't exist yet
    const accountObject: AccountEntity = {
      id: event.params.owner.toString(),
      balance: 0n,
    };
    context.Account.set(accountObject);
  }

  const approvalId = `${event.params.owner.toString()}-${event.params.spender.toString()}`;

  const approvalObject: ApprovalEntity = {
    id: approvalId,
    amount: event.params.value,
    owner_id: event.params.owner.toString(),
    spender_id: event.params.spender.toString(),
  };

  // Creating or updating Approval
  context.Approval.set(approvalObject);
});

ERC20Contract_Transfer_loader(({ event, context }) => {
  // Loading the Account entities for sender and receiver
  context.Account.load(event.params.from.toString());
  context.Account.load(event.params.to.toString());
});

ERC20Contract_Transfer_handler(({ event, context }) => {
  let senderAccount = context.Account.get(event.params.from.toString());

  if (!senderAccount) {
    // Creating the sender account if it doesn't exist
    const accountObject: AccountEntity = {
      id: event.params.from.toString(),
      balance: -event.params.value,
    };
    context.Account.set(accountObject);
  } else {
    // Updating the existing sender account balance
    senderAccount.balance -= event.params.value;
    context.Account.set(senderAccount);
  }

  let receiverAccount = context.Account.get(event.params.to.toString());

  if (!receiverAccount) {
    // Creating the receiver account if it doesn't exist
    const accountObject: AccountEntity = {
      id: event.params.to.toString(),
      balance: event.params.value,
    };
    context.Account.set(accountObject);
  } else {
    // Updating the existing receiver account balance
    receiverAccount.balance += event.params.value;
    context.Account.set(receiverAccount);
  }
});

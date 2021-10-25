---
title: Serialization
parent: Developer resources
taxonomy:
    category:
        - docs
---

* TOC
{:toc}

## Basic Types

<div class="big-table3">
   <div id="amount"><b>Amount</b></div>
   <div>8&nbsp;ubytes</div>
   <div class="description"></div>
   <div id="height"><b>Height</b></div>
   <div>8&nbsp;ubytes</div>
   <div class="description"></div>
   <div id="timestamp"><b>Timestamp</b></div>
   <div>4&nbsp;ubytes</div>
   <div class="description"></div>
   <div id="address"><b>Address</b></div>
   <div>40&nbsp;ubytes</div>
   <div class="description"></div>
   <div id="hash256"><b>Hash256</b></div>
   <div>32&nbsp;ubytes</div>
   <div class="description"></div>
   <div id="publickey"><b>PublicKey</b></div>
   <div>32&nbsp;ubytes</div>
   <div class="description"></div>
   <div id="signature"><b>Signature</b></div>
   <div>64&nbsp;ubytes</div>
   <div class="description"></div>
</div>

## Enumerations

### NetworkType
{:.no_toc}

{% include serialization/NetworkType.html %}

### TransactionType
{:.no_toc}

{% include serialization/TransactionType.html %}

### BlockType
{:.no_toc}

{% include serialization/BlockType.html %}

### LinkAction
{:.no_toc}

{% include serialization/LinkAction.html %}

### MosaicTransferFeeType
{:.no_toc}

{% include serialization/MosaicTransferFeeType.html %}

### MosaicSupplyChangeAction
{:.no_toc}

{% include serialization/MosaicSupplyChangeAction.html %}

### MultisigAccountModificationType
{:.no_toc}

{% include serialization/MultisigAccountModificationType.html %}

### MessageType
{:.no_toc}

{% include serialization/MessageType.html %}

## Structures

### Block
{:.no_toc}

{% include serialization/Block.html %}

### AccountKeyLinkTransaction
{:.no_toc}

{% include serialization/AccountKeyLinkTransaction.html %}

### NamespaceId
{:.no_toc}

{% include serialization/NamespaceId.html %}

### MosaicId
{:.no_toc}

{% include serialization/MosaicId.html %}

### Mosaic
{:.no_toc}

{% include serialization/Mosaic.html %}

### MosaicLevy
{:.no_toc}

{% include serialization/MosaicLevy.html %}

### MosaicProperty
{:.no_toc}

{% include serialization/MosaicProperty.html %}

### MosaicDefinition
{:.no_toc}

{% include serialization/MosaicDefinition.html %}

### MosaicDefinitionTransaction
{:.no_toc}

{% include serialization/MosaicDefinitionTransaction.html %}

### MosaicSupplyChangeTransaction
{:.no_toc}

{% include serialization/MosaicSupplyChangeTransaction.html %}

### MultisigAccountModification
{:.no_toc}

{% include serialization/MultisigAccountModification.html %}

### MultisigAccountModificationTransaction2
{:.no_toc}

{% include serialization/MultisigAccountModificationTransaction2.html %}

### Cosignature
{:.no_toc}

{% include serialization/Cosignature.html %}

### MultisigTransaction
{:.no_toc}

{% include serialization/MultisigTransaction.html %}

### NamespaceRegistrationTransaction
{:.no_toc}

{% include serialization/NamespaceRegistrationTransaction.html %}

### Message
{:.no_toc}

{% include serialization/Message.html %}

### TransferTransaction2
{:.no_toc}

{% include serialization/TransferTransaction2.html %}

## Inner Structures

These are structures only meant to be included inside other structures.
Their description is already present in the containing structures above and is only repeated here for completeness.

### EntityBody
{:.no_toc}

{% include serialization/EntityBody.html %}

### Transaction
{:.no_toc}

{% include serialization/Transaction.html %}

### MultisigAccountModificationTransaction
{:.no_toc}

{% include serialization/MultisigAccountModificationTransaction.html %}

### TransferTransaction
{:.no_toc}

{% include serialization/TransferTransaction.html %}


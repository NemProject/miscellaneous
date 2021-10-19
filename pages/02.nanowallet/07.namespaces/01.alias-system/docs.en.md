---
title: '@Alias System'
parent: Namespaces
grand_parent: NanoWallet
nav_order: 1
taxonomy:
    category:
        - docs
---

## Alias System

NEM's namespaces also act as aliases for addresses. Since every namespace is associated with a specific account, it's possible to use each namespace in place of an account address by adding @ to the front.

For example, the namespace crypto.news is associated with its owner's address NAWNNR-2SEDKU-YOBSKU-Q3VLZE-7WQW3D-YJ6UTE-SXOJ.

If you want to send a transaction to this account, you can enter @crypto.news in the recipient's address field and the transaction will reach that address.

This is useful because it makes it easy to tell whether you are really sending funds to a legitimate crypto.news address, as opposed to a 40-digit address string which could belong to anyone.
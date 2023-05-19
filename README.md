# NEM Miscellaneous Monorepo

In Q2 2023, we consolidated a number of projects into this repository.
It includes the NanoWallet, NEM Documentation and NEM docker.

| component                               | lint                                                             | build                                                              | test                                                             | coverage                                                         | package |
|-----------------------------------------|------------------------------------------------------------------|--------------------------------------------------------------------|------------------------------------------------------------------|------------------------------------------------------------------|---------|
| [@explorer/frontend](explorer/frontend) | [![lint][nem-explorer-frontend-lint]][nem-explorer-frontend-job] | [![build][nem-explorer-frontend-build]][nem-explorer-frontend-job] | [![test][nem-explorer-frontend-test]][nem-explorer-frontend-job] | [![][nem-explorer-frontend-cov]][nem-explorer-frontend-cov-link] |         |
| [@nanowallet](nanowallet)               | [![lint][nanowallet-lint]][nanowallet-job]                       | [![build][nanowallet-build]][nanowallet-job]                       | [![build][nanowallet-test]][nanowallet-job]                      | [![][nanowallet-cov]][nanowallet-cov-link]                       |         |
| [@nem-docker](nem-docker)               | [![lint][nem-docker-lint]][nem-docker-job]                       |                                                                    |                                                                  |                                                                  |         |
| [@nem-docs](nem-docs)                   |                                                                  |                                                                    |                                                                  |                                                                  |         |
| [@nem-openapi](nem-openapi)             | [![lint][nem-openapi-lint]][nem-openapi-job]                     | [![build][nem-openapi-build]][nem-openapi-job]                     | [![test][nem-openapi-test]][nem-openapi-job]                     |                                                                  |         |
| [@nemesis-generator](nemesis-generator) | [![lint][nemesis-generator-lint]][nemesis-generator-job]         |                                                                    | [![test][nemesis-generator-test]][nemesis-generator-job]         | [![lint][nemesis-generator-cov]][nemesis-generator-cov-link]     |         |
| [@nem-website](website)                 | [![lint][website-lint]][website-job]                             | [![build][website-build]][website-job]                             | [![test][website-test]][website-job]                             | [![lint][website-cov]][website-cov-link]                         |         |

## Full Coverage Report

Detailed version can be seen on [codecov.io][miscellaneous-cov-link].

[![][miscellaneous-cov]][miscellaneous-cov-link]

[miscellaneous-cov]: https://codecov.io/gh/NemProject/miscellaneous/branch/dev/graphs/tree.svg
[miscellaneous-cov-link]: https://codecov.io/gh/NEMProject/miscellaneous/tree/dev

[nem-explorer-frontend-job]: https://jenkins.symboldev.com/blue/organizations/jenkins/Nem%2Fgenerated%2Fmiscellaneous%2Fexplorer-frontend/activity/?branch=dev
[nem-explorer-frontend-lint]: https://jenkins.symboldev.com/buildStatus/icon?job=Nem%2Fgenerated%2Fmiscellaneous%2Fexplorer-frontend%2Fdev%2F&config=nem-explorer-frontend-lint
[nem-explorer-frontend-build]: https://jenkins.symboldev.com/buildStatus/icon?job=Nem%2Fgenerated%2Fmiscellaneous%2Fexplorer-frontend%2Fdev%2F&config=nem-explorer-frontend-build
[nem-explorer-frontend-test]: https://jenkins.symboldev.com/buildStatus/icon?job=Nem%2Fgenerated%2Fmiscellaneous%2Fexplorer-frontend%2Fdev%2F&config=nem-explorer-frontend-test
[nem-explorer-frontend-cov]: https://codecov.io/gh/NemProject/miscellaneous/branch/dev/graph/badge.svg?token=gYl6U8kJfi&flag=nem-explorer-frontend
[nem-explorer-frontend-cov-link]: https://app.codecov.io/gh/NEMProject/miscellaneous/tree/dev/explorer/frontend

[nanowallet-job]: https://jenkins.symboldev.com/blue/organizations/jenkins/Nem%2Fgenerated%2Fmiscellaneous%2Fnanowallet/activity?branch=dev
[nanowallet-lint]: https://jenkins.symboldev.com/buildStatus/icon?job=Nem%2Fgenerated%2Fmiscellaneous%2Fnanowallet%2Fdev%2F&config=nem-nanowallet-lint
[nanowallet-build]: https://jenkins.symboldev.com/buildStatus/icon?job=Nem%2Fgenerated%2Fmiscellaneous%2Fnanowallet%2Fdev%2F&config=nem-nanowallet-build
[nanowallet-test]: https://jenkins.symboldev.com/buildStatus/icon?job=Nem%2Fgenerated%2Fmiscellaneous%2Fnanowallet%2Fdev%2F&config=nem-nanowallet-test
[nanowallet-cov]: https://codecov.io/gh/symbol/symbol/branch/dev/graph/badge.svg?token=gYl6U8kJfi&flag=nanowallet
[nanowallet-cov-link]: https://codecov.io/gh/symbol/symbol/tree/dev/nanowallet

[nem-docker-job]: https://jenkins.symboldev.com/blue/organizations/jenkins/Nem%2Fgenerated%2Fmiscellaneous%2Fnem-docker/activity?branch=dev
[nem-docker-lint]: https://jenkins.symboldev.com/buildStatus/icon?job=Nem%2Fgenerated%2Fmiscellaneous%2Fnem-docker%2Fdev%2F&config=nem-docker-lint

[nem-openapi-job]: https://jenkins.symboldev.com/blue/organizations/jenkins/Nem%2Fgenerated%2Fmiscellaneous%2Fnem-openapi/activity?branch=dev
[nem-openapi-lint]: https://jenkins.symboldev.com/buildStatus/icon?job=Nem%2Fgenerated%2Fmiscellaneous%2Fnem-openapi%2Fdev%2F&config=nem-openapi-lint
[nem-openapi-build]: https://jenkins.symboldev.com/buildStatus/icon?job=Nem%2Fgenerated%2Fmiscellaneous%2Fnem-openapi%2Fdev%2F&config=nem-openapi-build
[nem-openapi-test]: https://jenkins.symboldev.com/buildStatus/icon?job=Nem%2Fgenerated%2Fmiscellaneous%2Fnem-openapi%2Fdev%2F&config=nem-openapi-test

[nemesis-generator-job]: https://jenkins.symboldev.com/blue/organizations/jenkins/Nem%2Fgenerated%2Fmiscellaneous%2Fnemesis-generator/activity?branch=dev
[nemesis-generator-lint]: https://jenkins.symboldev.com/buildStatus/icon?job=Nem%2Fgenerated%2Fmiscellaneous%2Fnemesis-generator%2Fdev%2F&config=nemesis-generator-lint
[nemesis-generator-test]: https://jenkins.symboldev.com/buildStatus/icon?job=Nem%2Fgenerated%2Fmiscellaneous%2Fnemesis-generator%2Fdev%2F&config=nemesis-generator-test
[nemesis-generator-cov]: https://codecov.io/gh/NemProject/miscellaneous/branch/dev/graph/badge.svg?token=gYl6U8kJfi&flag=nemesis-generator
[nemesis-generator-cov-link]: https://app.codecov.io/gh/NEMProject/miscellaneous/tree/dev/nemesis-generator

[website-job]: https://jenkins.symboldev.com/blue/organizations/jenkins/Nem%2Fgenerated%2Fmiscellaneous%2Fwebsite/activity?branch=dev
[website-lint]: https://jenkins.symboldev.com/buildStatus/icon?job=Nem%2Fgenerated%2Fmiscellaneous%2Fwebsite%2Fdev%2F&config=nem-website-lint
[website-build]: https://jenkins.symboldev.com/buildStatus/icon?job=Nem%2Fgenerated%2Fmiscellaneous%2Fwebsite%2Fdev%2F&config=nem-website-build
[website-test]: https://jenkins.symboldev.com/buildStatus/icon?job=Nem%2Fgenerated%2Fmiscellaneous%2Fwebsite%2Fdev%2F&config=nem-website-test
[website-cov]: https://codecov.io/gh/NemProject/miscellaneous/branch/dev/graph/badge.svg?token=gYl6U8kJfi&flag=nem-website
[website-cov-link]: https://app.codecov.io/gh/NEMProject/miscellaneous/tree/dev/website
git 
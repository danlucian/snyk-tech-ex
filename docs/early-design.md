## Introduction

This service should return the full package dependency tree based on a given package name (user input), applicable in the NodeJS ecosystem via the NPM.

## Requirements and goals of the system

**Functional:**

1. Given the name of a published npm package, the system must return the entire set of dependencies for the package.
1. The results must be presented in a tree view.
1. The data should be cached in order to improve the overall latency of the system.

**Non-functional:**

1. The system should be reliable and tested.
1. The tree view should be displayed fast, with low latency.
1. Asynchronicity of the operations should be in place.


**Extended requirements:**

1. The fetched dependencies should be compared with Snyk's database of vulnerable packages in order to identify whether any of the dependencies are vulnerable.
1. For any package that is identified as vulnerable, the system should list all available remediation paths (upgrades and/or patches for vulnerable packages) for the user.
1. The user chooses their preferred remediation actions from the list presented by the above step, and the system should apply them by creating a PR for the relevant code repository.

## Capacity estimation and constraints

The system is a read-heavy one. No writes are involved in its early stage.

Currently, Snyk has __2.2M__ active customers. We will double up this number to __4M__ and compute the estimates on a daily basis where applicable (the doubling of the number will help us handle future unexpected peaks).

The check for vulnerabilities in the dependencies usually happens before each production release. Lets suppose the Snyk customers threat each commit as a release candidate and they have __5 daily checks__ for their dependencies.

To sum up we have: __4M daily active customers__ having, on average, __5 daily checks__ for their dependencies.


**Traffic estimates:** Assuming we have 4M daily users x 5 daily check this results in:

<center><span style="color:#6722AC">5 x 4M => 20M daily interactions</span></center>

What would be the "Queries Per Second" (QPS) indicator for our system?

<center><span style="color:#6722AC">20 million / (24 hours * 3600 seconds) = ~232 QPS</span></center>


**Storage estimates:**

At this point, our services are stateless and no persistence layer is needed. Our source of truth is the NPM registry (available at https://registry.npmjs.org/) and all the data we need we will fetch from the registry.

We will consider caching, but the estimates will be covered in sections below.


**Bandwidth estimates (income data):**

Considering the rules presented here (https://github.com/npm/validate-npm-package-name) a valid NPM package name should not exceed 214 characters.

The best case scenario in terms of package name size would be 1 and worst case 214.

We suppose the average size is a quarter of the maximum: 214 / 4 => 54.

Our context would be:

<center><span style="color:#6722AC">232 QPS * 54 bytes = 12528 bytes => ~ 13 KB/s</span></center>

If we need a more in depth look considering headers and other stuff, lets suppose we also add:

- ~200 bytes for headers (e.g. content-type, date, cache-control, etags, http versions...)
- ~304 bytes for a JWT header

Our full payload that the system will ingest could be:

<center><span style="color:#6722AC">232 QPS * (54 + 200 + 304) bytes = 129456 bytes => ~ 130 KB/s</span></center>


**Memory estimates:**

If we want to cache some of the hot packages that are frequently verified, how much memory will we need to store them? If we follow the 80-20 rule, meaning 20% of packages generate 80% of traffic, we would like to cache these 20% hot packages.

But first, lets see how much space is needed for storing a package in cache on average (considering top 5 most popular packages for devs - https://www.esparkinfo.com/node-js-packages.html):

- ExpressJS (https://github.com/expressjs/express/blob/master/package.json): 2705 characters + 475 spaces = 3180 characters (bytes)
- Async (https://github.com/caolan/async/blob/master/package.json): 2454 characters + 395 spaces = 2849 characters (bytes)
- Request (https://github.com/request/request/blob/master/package.json): 1999 characters + 378 spaces = 2377 characters (bytes)
- Grunt (https://github.com/gruntjs/grunt/blob/main/package.json): 1385 characters + 275 spaces = 1660 characters (bytes)
- PM2 (https://raw.githubusercontent.com/Unitech/pm2/master/package.json): 4184 characters + 1003 spaces = 5187 characters (bytes)


The average size is for a package.json: 
<center><span style="color:#6722AC">(3180 + 2849 + 2377 + 1660 + 5187) / 5 = 3050 bytes</span></center>

Since we have 232 requests per second, we will be getting 20 million requests per day. To cache 20% of these requests, we will need 12.2 GB of memory:

<center><span style="color:#6722AC">0.2 * 20 million * 3050 bytes = 12 200 000 000 bytes => 12.2 GB</span></center>


**High-level estimates:**

| Operation                     | Resources  |
| -----------                   |----------- |
| Active users                  | 4 million  |
| Daily scans                   | 5          |
| QPS                           | 232        |
| Inbound bandwith              | 130 KB/s   |
| Caching memory (20% rule)     | 12.2 GB    |


## API Definition

## Architectural diagram

## Load balancing

## Caching

## Observability (logs, metrics)

## Future design considerations
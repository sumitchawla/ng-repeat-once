[![Build Status](https://travis-ci.org/sumitchawla/ng-repeat-once.svg?branch=master)](https://travis-ci.org/sumitchawla/ng-repeat-once) [![Dependency Status](https://david-dm.org/sumitchawla/ng-repeat-once.png)](https://david-dm.org/sumitchawla/ng-repeat-once) [![devDependency Status](https://david-dm.org/sumitchawla/ng-repeat-once/dev-status.png)](https://david-dm.org/sumitchawla/ng-repeat-once#info=devDependencies)

ng-repeat-once
=================

Inspired by Bindonce binding for AngularJS, ng-repeat-once is a one-time binding for collection elements.  Collection is just bound once, and any changed to the collection thereafter are not observed.

This binding can be used for collections which are not expected to change.  Using this you can avoid the overhead of unneccessary watch expressions on this collection

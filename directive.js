angular.module("ch.directives",[])
.directive('ngRepeatOnce', ['$parse', '$animate', function($parse, $animate) {
  return {
    restrict: 'A',
    multiElement: true,
    transclude: 'element',
    priority: 1000,
    terminal: true,
    $$tlb: true,
    compile: function ngRepeatCompile($element, $attr) {
      var expression = $attr.ngRepeatOnce;
      var match = expression.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

      if (!match) {
        throw Error('iexp', "Expected expression in form of '_item_ in _collection_[ track by _id_]' but got '{0}'.",
            expression);
      }

      var lhs = match[1];
      var rhs = match[2];
      var aliasAs = match[3];

      match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);

      if (!match) {
        throw Error('iidexp', "'_item_' in '_item_ in _collection_' should be an identifier or '(_key_, _value_)' expression, but got '{0}'.",
            lhs);
      }
      var valueIdentifier = match[3] || match[1];
      var keyIdentifier = match[2];

      if (aliasAs && (!/^[$a-zA-Z_][$a-zA-Z0-9_]*$/.test(aliasAs) ||
          /^(null|undefined|this|\$index|\$first|\$middle|\$last|\$even|\$odd|\$parent)$/.test(aliasAs))) {
        throw Error('badident', "alias '{0}' is invalid --- must be a valid JS identifier which is not a reserved name.",
          aliasAs);
      }

      return function ($scope, $element, $attr, ctrl, $transclude) {
        //watch props
       var unwatch = $scope.$watchCollection(rhs, function ngRepeatAction(collection) {
          var index, length,
              previousNode = $element[0],     // node that cloned nodes should be inserted after
              collectionLength,
              key, value, // key/value of iteration
              collectionKeys;

          if (aliasAs) {
            $scope[aliasAs] = collection;
          }

          collectionLength = collection.length;
          if (angular.isArray(collection)) {
            collectionKeys = collection;
          } else {
            // if object, extract keys, sort them and use to determine order of iteration over obj props
            collectionKeys = [];
            for (var itemKey in collection) {
              if (collection.hasOwnProperty(itemKey) && itemKey.charAt(0) != '$') {
                collectionKeys.push(itemKey);
              }
            }
            collectionKeys.sort();
          }

          // we are not using forEach for perf reasons (trying to avoid #call)
          for (index = 0; index < collectionLength; index++) {
            key = (collection === collectionKeys) ? index : collectionKeys[index];
            value = collection[key];
            $transclude(function (clone, scope) {
                $animate.enter(clone, null, angular.element(previousNode));
                scope[valueIdentifier] = value;
                if (keyIdentifier) scope[keyIdentifier] = key;
                scope.$index = index;
                scope.$first = (index === 0);
                scope.$last = (index === (collectionLength - 1));
                scope.$middle = !(scope.$first || scope.$last);
                scope.$odd = !(scope.$even = (index&1) === 0);
              });
          }
          unwatch();
        });
      };
    }
  };
}]);

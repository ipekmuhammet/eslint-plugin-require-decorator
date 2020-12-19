const getDecoratorName = decorator => decorator
	&& decorator.expression
	&& (decorator.expression.callee
		&& decorator.expression.callee.name
		|| decorator.expression.name)

const getMissingDecorators = (currentDecorators = [], requiredDecoratorNames = []) => {
	const currentDecoratorNames = currentDecorators.map((decorator) => getDecoratorName(decorator))

	return requiredDecoratorNames.filter((decorator) => {
		return !currentDecoratorNames.includes(decorator)
	})
}

const isClassValid = (classDecarators = [], requiredDecoratorNames = []) => {
	const classDecaratorNames = classDecarators.map((decorator) => getDecoratorName(decorator))

	return requiredDecoratorNames.every((decorator) => {
		return classDecaratorNames.includes(decorator)
	})
}

const isConstructor = (node) => {
	if(node.key.name === 'constructor'){
		return true;
	}

	return false;
}

const createMapping = (node, option) => {
	const missingDecorators = getMissingDecorators(node.decorators, option.methodDecorators)
	const clss = node.parent.parent

	if(
		missingDecorators.length === 0 
		|| isConstructor(node) 
		|| !isClassValid(clss.decorators, option.classDecorators)){
		return {
			missingDecorators: []
		}
	}

	return {
		missingDecorators,
		mapping: {
			method: node.key.name,
			missingDecorators: missingDecorators.join(', ')
		}
	}
}

module.exports.rules = {
	"require-decorator": {
		name: "require-decorator",
		meta: {
			fixable: "code",
			type: "suggestion",
			docs: {
				description: "Enforce required-decorators",
				recommended: "error"
			},
			messages: {
				method: "'{{method}}' has missing decorators: {{missingDecorators}}"
			}
		},
		create: context => {
			return {
				MethodDefinition(node) {
					const options = context.options || []

					options.map((option) => {
						const { missingDecorators, mapping } = createMapping(node, option)

						if(missingDecorators.length > 0){
							context.report({
								node,
								messageId: "method",
								data: mapping,
								fix: function(fixer) {
									return fixer.insertTextBefore(node, missingDecorators.map((decorator) => `@${decorator}() \r\n `).join(''));
								}
							})
						}
					})
				}
			}
		}
	}
}
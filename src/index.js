const getDecoratorName = decorator => decorator?.expression?.callee?.name ?? decorator.expression.name

const getMissingDecorators = (currentDecorators = [], requiredDecorators = []) => {
	const currentDecoratorNames = currentDecorators.map(getDecoratorName)

	return requiredDecorators.filter(requiredDecorator => {
		if (requiredDecorator.oneOfThem && Array.isArray(requiredDecorator.oneOfThem)) {
			return !requiredDecorator.oneOfThem.some((oneOfRequiredDecorator) => currentDecoratorNames.includes(oneOfRequiredDecorator))
		}

		return !currentDecoratorNames.includes(requiredDecorator)
	})
}

const isClassValid = (classDecarators = [], requiredDecorators = []) => {
	const classDecaratorNames = classDecarators.map(getDecoratorName)

	return requiredDecorators.every(requiredDecorator => classDecaratorNames.includes(requiredDecorator))
}

const isConstructor = (node) => {
	return node.key.name === "constructor"
}

const logMissingDecorators = (missingDecorators) => {
	return missingDecorators.map((decorator) => {
		if (decorator.oneOfThem && Array.isArray(decorator.oneOfThem)) {
			return decorator.oneOfThem.join(" || ")
		}
	
		return decorator
	}).join(", ")
}

const createMapping = (node, option) => {
	const missingDecorators = getMissingDecorators(node.decorators, option.methodDecorators)
	const clss = node.parent.parent

	if (
		missingDecorators.length === 0
		|| isConstructor(node)
		|| !isClassValid(clss.decorators, option.classDecorators)) {
		return {
			missingDecorators: []
		}
	}

	return {
		missingDecorators,
		mapping: {
			method: node.key.name,
			missingDecorators: logMissingDecorators(missingDecorators)
		}
	}
}

const fixerFn = (missingDecorators) => {
	return missingDecorators.map(decorator => {
		if (decorator.oneOfThem && Array.isArray(decorator.oneOfThem)) {
			return "" // decorator.oneOfThem.map(oneOfDecorator => `@${oneOfDecorator}() \r\n `).join("") // TODO fix others and in oneOfThem suggest oneOfThem :)
		}

		return `@${decorator}() \r\n `
	}).join("")
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

					options.map(option => {
						const { missingDecorators, mapping } = createMapping(node, option)

						if (missingDecorators.length > 0) {
							context.report({
								node,
								messageId: "method",
								data: mapping,
								fix: function (fixer) {
									return fixer.insertTextBefore(node, fixerFn(missingDecorators))
								}
							})
						}
					})
				}
			}
		}
	}
}
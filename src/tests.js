const { RuleTester } = require('@typescript-eslint/experimental-utils/dist/ts-eslint/RuleTester');
const { rules } = require("./index");

const ruleTester = new RuleTester({
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
		ecmaFeatures: {},
	},
	parser: require.resolve('@typescript-eslint/parser'),
});

const code = `
@Controller('users')
class UserController {
	test!: number;

	constructor(test: number) {
		this.test = test;
	}

	@ApiOperation()
	private getUserById(
		userId: number
	): void {
		return;
	}

	@ApiOperation()
	@ApiResponse()
	deleteUserById(
		userId: number
	): void {
		return;
	}

	async updateUserById(
		userId: number
	): void {
		return;
	}
}

@Test('test')
class TestSrvc {
	test!: number;

	@TestDecorator()
	testMethod(
		userId: number
	): void {
		return;
	}

	@TestDecorator()
	@TestDecorator2()
	testMethod2(
		userId: number
	): void {
		return;
	}
}
`

ruleTester.run('require-decorator', rules["require-decorator"], {
	valid: [

	],
	invalid: [
		{
			code,
			options: [
				{
					classDecorators: [
						'Controller'
					],
					methodDecorators: [
						'ApiOperation',
						'ApiResponse'
					]
				},
				{
					classDecorators: [
						'Test'
					],
					methodDecorators: [
						'TestDecorator',
						'TestDecorator2'
					]
				}
			],
			errors: [
				{
					messageId: "method",
					data: {
						method: "getUserById",
						missingDecorators: "ApiResponse"
					}
				},
				{
					messageId: "method",
					data: {
						method: "updateUserById",
						missingDecorators: "ApiOperation, ApiResponse"
					}
				},
				{
					messageId: "method",
					data: {
						method: "testMethod",
						missingDecorators: "TestDecorator2"
					}
				}
			],
		}
	]
});
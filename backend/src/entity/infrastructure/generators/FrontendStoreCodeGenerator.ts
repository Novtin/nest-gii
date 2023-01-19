import * as fs from 'node:fs';
import * as path from 'path';
import {escapeRegExp, camelCase, upperFirst, sortBy, reverse} from 'lodash';
import {CreateReduxStoreDto} from '../../domain/dtos/CreateReduxStoreDto';
import * as ts from 'typescript';
import {tab} from '../../domain/helpers/tab';
import {insertString} from '../../domain/helpers/insertString';
import * as util from 'util';

const ENTITY_NAME_PLACEHOLDER = '%entityName%';
const ENTITY_NAME_UPPER_CASE_PLACEHOLDER = '%entityNameUpperCase%';
const ENTITY_NAME_CAMEL_CASE_PLACEHOLDER = '%entityNameCamelCase%';


const resultPaths = {
    reducer: `reducers/${ENTITY_NAME_PLACEHOLDER}.ts`,
    actions: `actions/${ENTITY_NAME_PLACEHOLDER}.ts`,
    reducersIndex: `reducers/index.ts`,
}

const templates = {
    reducer: 'ReducerTemplate.txt',
    actions: 'ActionsTemplate.txt',
    reducersIndex: 'ReducersIndex.txt',
}

export class FrontendStoreCodeGenerator {
    readonly entityName: string;
    readonly projectRootPath: string
    readonly placeholdersValuesMap: Record<string, string> = {};

    private readonly reducersFileImports: string;

    constructor(
        createStoreDto: CreateReduxStoreDto,
        rootPath: string = null,
    ) {
        this.entityName = createStoreDto.name;
        this.reducersFileImports = `import ${this.entityName} from './${this.entityName}';`;

        this.projectRootPath = rootPath || process.cwd();

        this.placeholdersValuesMap = {
            [ENTITY_NAME_PLACEHOLDER]: this.entityName,
            [ENTITY_NAME_UPPER_CASE_PLACEHOLDER]: this.entityName.toUpperCase(),
            [ENTITY_NAME_CAMEL_CASE_PLACEHOLDER]:  upperFirst(camelCase(this.entityName)),
        }
    }

    public generate() {
        const allFileTypes = Object.keys(templates);
        const isReducersFileExists = fs.existsSync(path.resolve(
            this.projectRootPath,
            'src/reducers/index.ts',
        ));

        for (const fileType of allFileTypes) {
            if (fileType !== 'reducersIndex' || !isReducersFileExists) {
                this.generateFileByType(fileType);
            } else {
                this.updateReducersFile();
            }
        }
    }

    private updateReducersFile() {
        let itemsToInsert = [];
        const filePath = path.resolve(
            this.projectRootPath,
            'src/reducers/index.ts',
        );
        let fileContent = fs.readFileSync(filePath).toString();

        const ast: any = ts.createSourceFile(
            'thisFileWillNotBeCreated.ts',
            fileContent,
            ts.ScriptTarget.Latest
        ).statements;

        const lastImportNode = ast.reduce((prevImportNode, node) => node.importClause ? node : prevImportNode, null);
        itemsToInsert.push({
            text: '\n' + this.reducersFileImports,
            position: lastImportNode.end,
        });

        const reducersNode = ast.find(node => node?.expression?.body?.expression?.escapedText === 'combineReducers');

        console.log(util.inspect(reducersNode?.expression?.body?.arguments, {depth: 3, colors: true}));

        itemsToInsert.push({
            text: `\n${tab()}${this.entityName},`,
            position: reducersNode?.expression?.body?.arguments?.[0]?.properties?.at(-1)?.end + 1,
        });

        itemsToInsert = reverse(sortBy(itemsToInsert, 'position'));
        for (const itemToInsert of itemsToInsert) {
            fileContent = insertString(fileContent, itemToInsert.text, itemToInsert.position);
        }

        fs.writeFileSync(filePath, fileContent);
    }

    private generateFileByType(fileType) {
        const templatePath = path.resolve(__dirname,  '../../../../public/templates/frontend');

        let resultFileContent = fs.readFileSync(
            path.resolve(templatePath, templates[fileType]),
            'utf8',
        );

        for (const placeholder in this.placeholdersValuesMap) {
            resultFileContent = resultFileContent.replace(
                new RegExp(`${escapeRegExp(placeholder)}`, 'g'),
                this.placeholdersValuesMap[placeholder],
            );
        }

        let resultFilePath = path.resolve(
            this.projectRootPath,
            'src',
            resultPaths[fileType]
                .replace(ENTITY_NAME_PLACEHOLDER, this.entityName)
        );

        const resultFileDirPath = path.dirname(resultFilePath);
        if (!fs.existsSync(resultFileDirPath)){
            fs.mkdirSync(resultFileDirPath, {recursive: true});
        }

        fs.writeFileSync(
            resultFilePath,
            resultFileContent,
        );
    }
}

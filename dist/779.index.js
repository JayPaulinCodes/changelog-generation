"use strict";
exports.id = 779;
exports.ids = [779];
exports.modules = {

/***/ 3779:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "readPackageUp": () => (/* binding */ readPackageUp),
  "readPackageUpSync": () => (/* binding */ readPackageUpSync)
});

// EXTERNAL MODULE: external "node:path"
var external_node_path_ = __webpack_require__(9411);
// EXTERNAL MODULE: external "node:process"
var external_node_process_ = __webpack_require__(7742);
// EXTERNAL MODULE: external "node:fs/promises"
var promises_ = __webpack_require__(3977);
// EXTERNAL MODULE: external "node:url"
var external_node_url_ = __webpack_require__(1041);
// EXTERNAL MODULE: external "node:fs"
var external_node_fs_ = __webpack_require__(7561);
;// CONCATENATED MODULE: ./node_modules/find-up-simple/index.js






const toPath = urlOrPath => urlOrPath instanceof URL ? (0,external_node_url_.fileURLToPath)(urlOrPath) : urlOrPath;

async function findUp(name, {
	cwd = external_node_process_.cwd(),
	type = 'file',
	stopAt,
} = {}) {
	let directory = external_node_path_.resolve(toPath(cwd) ?? '');
	const {root} = external_node_path_.parse(directory);
	stopAt = external_node_path_.resolve(directory, toPath(stopAt ?? root));

	while (directory && directory !== stopAt && directory !== root) {
		const filePath = external_node_path_.isAbsolute(name) ? name : external_node_path_.join(directory, name);

		try {
			const stats = await promises_.stat(filePath); // eslint-disable-line no-await-in-loop
			if ((type === 'file' && stats.isFile()) || (type === 'directory' && stats.isDirectory())) {
				return filePath;
			}
		} catch {}

		directory = external_node_path_.dirname(directory);
	}
}

function findUpSync(name, {
	cwd = external_node_process_.cwd(),
	type = 'file',
	stopAt,
} = {}) {
	let directory = external_node_path_.resolve(toPath(cwd) ?? '');
	const {root} = external_node_path_.parse(directory);
	stopAt = external_node_path_.resolve(directory, toPath(stopAt) ?? root);

	while (directory && directory !== stopAt && directory !== root) {
		const filePath = external_node_path_.isAbsolute(name) ? name : external_node_path_.join(directory, name);

		try {
			const stats = external_node_fs_.statSync(filePath, {throwIfNoEntry: false});
			if ((type === 'file' && stats?.isFile()) || (type === 'directory' && stats?.isDirectory())) {
				return filePath;
			}
		} catch {}

		directory = external_node_path_.dirname(directory);
	}
}

// EXTERNAL MODULE: ./node_modules/read-pkg/index.js + 3 modules
var read_pkg = __webpack_require__(361);
;// CONCATENATED MODULE: ./node_modules/read-package-up/index.js




async function readPackageUp(options) {
	const filePath = await findUp('package.json', options);
	if (!filePath) {
		return;
	}

	return {
		packageJson: await (0,read_pkg.readPackage)({...options, cwd: external_node_path_.dirname(filePath)}),
		path: filePath,
	};
}

function readPackageUpSync(options) {
	const filePath = findUpSync('package.json', options);
	if (!filePath) {
		return;
	}

	return {
		packageJson: (0,read_pkg.readPackageSync)({...options, cwd: external_node_path_.dirname(filePath)}),
		path: filePath,
	};
}


/***/ })

};
;
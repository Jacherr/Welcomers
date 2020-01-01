// module.exports = class Flag {
//   constructor (options) {
//     this.name = options.name
//     if (!this.name) {
//       throw new ReferenceError('Name is a required argument that is missing.')
//     }
//     this.value = options.value || null
//   }

//   static resolve (args) {
//     const flags = {}
//     for (let i = 0; i < args.length; i++) {
//       if (args[i].startsWith('-') && args[i].length > 1) {
//         flags[args[i].substr(1, args[i].length)] = new Flag({ name: args[i].substr(1, args[i].length) })
//       } else if (args[i].startsWith('--') && args[i].length > 1) {
//         flags[args[i].substr(2, args[i].length)] = new Flag({ nameame: args[i].substr(2, args[i].length), value: args[i + 1] })
//       }
//     }
//     return flags
//   }

//   static remove (args) {
//     args.forEach(arg => {
//       if (arg.startsWith('--') && flagsToRemove.map(i => i.name).includes(arg.slice(2))) {
//         args.splice(args.indexOf(arg), 2)
//       } else if (arg.startsWith('-') && flagsToRemove.map(i => i.name).includes(arg.slice(1))) {
//         args.splice(args.indexOf(arg), 1)
//       }
//     })
//     return args
//   }
// }

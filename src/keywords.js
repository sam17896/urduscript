'lang sweet.js';

// null
export syntax khali = function (ctx) {
    return #`null`;
}
export syntax khaali = function (ctx) {
    return #`null`;
}

// true
export syntax sahi = function (ctx) {
    return #`true`;
}

// false
export syntax galat = function (ctx) {
    return #`false`;
}
export syntax ghalat = function (ctx) {
    return #`false`;
}

// if
export syntax agar = function (ctx) {
	
    let ifparam = ctx.next().value
    let ifblock = ctx.next().value;
	let warnas = ctx.next();
	let ctxCounter = 3;
    let result = #`if ${ifparam} ${ifblock}`;
    while(!warnas.done){
		var isWarna = false;
		

		if (warnas.value.value.token.value === "warna"){
			let elseblock = ctx.next().value;
			result = result.concat(#`else ${elseblock}`)
			//isWarna = true;
			return result;
		}

		if (warnas.value.value.token.value === "warnaagar"){
			let elseifparam = ctx.next().value;
			let elseifblock = ctx.next().value;
			ctxCounter += 2
			result = result.concat(#`else if ${elseifparam} ${elseifblock}`)
			isWarna = true;
			
		}

		if (!isWarna) {
			// we fetched something beyond this code block. reset context and fwd correctly.
			ctx.reset()
			while (--ctxCounter){
				ctx.next()
			}
			
			return result;
		}

		warnas = ctx.next();
		ctxCounter++;
    }
    //console.log("warnas",warnas.value.token.value)
    
    return result
    //return #`if ${ifparam} ${ifblock}`;
}


// var
export syntax rakho = function (ctx) {
    return #`var`;
}

// while
export syntax jabtak = function (ctx) {
    let wparam = ctx.next().value
    let wblock = ctx.next().value;
    return #`while ${wparam} ${wblock}`;
}

// console.log
export syntax likho = function (ctx) {
    let params = ctx.next().value
    //let wblock = ctx.next().value;
    return #`console.log ${params}`;
}

// prompt (only works on browser right now)
export syntax pucho = function (ctx) {
    let params = ctx.next().value
    //let wblock = ctx.next().value;
    return #`prompt ${params}`;
}


// function
export syntax kaam = function (ctx) {
	let fname = ctx.next().value
	let fparam = ctx.next().value
	let fblock = ctx.next().value;

  return #`function ${fname} ${fparam} ${fblock}`;
}

// for and foreach loop
export syntax har = function (ctx) {
	let fparam = ctx.next().value
	
	if (fparam.type==="RawSyntax"){
		//foreach
		let fparamk = ctx.next().value;
		let fparamvar = ctx.next().value;
		let fblock = ctx.next().value;

		//ignore 'per' or 'pe' if present
		if (fblock.type==="RawSyntax" 
				&& (fblock.value.token.value==="per" || fblock.value.token.value==="pe")
			){
				fblock = ctx.next().value;
		}
		return #`for (var ${fparamvar} of ${fparam}) ${fblock}`;
	}
	else{
		let fblock = ctx.next().value;
		return #`for ${fparam} ${fblock}`;
	}
}

// return
export syntax bhejo = function (ctx) {
	let param = ctx.next().value;
    return #`return ${param}`;
}

//do while
export syntax karo = function(ctx) {
	let dblock = ctx.next().value;
	let jabtak = ctx.next();
	if(jabtak.value != null){
		if(jabtak.value.value.token.value === "jabtak"){
		//console.log(jabtak.value.value.token.value);
		let jabtakparams = ctx.next().value;
		return #`do ${dblock} while ${jabtakparams}`;
		} else {
			return #`console.log("galti: karo ke liye jabtak hona lazmi hai!")`;
		}
	} else {
		return #`console.log("galti: karo ke liye jabtak hona lazmi hai!")`;
	}
}

//try catch finally
export syntax koshish = function(ctx){
	let tryblock = ctx.next().value;
	let pakro = ctx.next();
	if(pakro.value!=null){
		if(pakro.value.value.token.value === "pakro"){
			let catchparams =ctx.next().value;
			let catchblock = ctx.next().value;
			let akhir = ctx.next();
			if(akhir.value!=null){
				if(akhir.value.value.token.value === "akhir"){
					let finallyblock = ctx.next().value;
					return #`try ${tryblock} catch ${catchparams} ${catchblock} finally ${finallyblock}`;
				} else {
					return #`console.log("galti: akhir sahi tarah nahin likha")`;
				}
			} else {
				return #`try ${tryblock} catch ${catchparams} ${catchblock}`;
			
			}
		}
	} else {
		return #`console.log("galti: koshish ke liye pakro hona lazmi hai!")`;
	}

}
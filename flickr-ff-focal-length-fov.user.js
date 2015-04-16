// ==UserScript==
// @name        Full Frame (35mm) Focal Length for Flickr
// @description Displays crop factor, 35mm equivalent & angular field of view on Flickr EXIF meta info pages.
// @version     1.14
// @namespace   https://www.flickr.com/services/apps/by/tarmo888
// @include     https://www.flickr.com/photos/*
// ==/UserScript==

(function(wnd) {
	function ff35mm() {
		this.t_fl = ['focal length', 'brennweite', 'lente', 'longueur focale', 'distância focal', '焦距', '초점거리', 'tiêu cự', 'jarak fokus'];
		this.t_fl35 = ['focal length (35mm format)', 'focal length in35mm format', 'focal length in 35mm film'];
		this.t_fpd = 'focal plane diagonal';
		this.t_fpxs = 'focal plane xsize';
		this.t_fpys = 'focal plane ysize';
		this.t_fpxr = ['focal plane x-resolution', 'focal plane xresolution'];
		this.t_fpyr = ['focal plane y-resolution', 'focal plane yresolution'];
		this.t_fpru = 'focal plane resolution unit';
		this.t_width = ['sensor width', 'image width', 'exif image width', 'related image width'];
		this.t_height = ['sensor height', 'image height', 'exif image height', 'related image height'];
		this.t_ztw = 'zoom target width';
		this.t_zsw = 'zoom source width';
		this.x_fl; this.x_fov;
		this.c_w = 36; this.c_h = 24; this.c_fpd35 = Math.sqrt(this.c_w*this.c_w+this.c_h*this.c_h);
		this.v_fl; this.v_fl35; this.v_fpd; this.v_fpxs; this.v_fpys; this.v_fpxr; this.v_fpyr; this.v_fpru; this.v_width; this.v_height; this.v_ztw; this.v_zsw;

		this.parseHtml = function(tag1, tag2, tag3) {
			var rows = document.getElementsByTagName(tag1);
			for (var row = 0; row < rows.length; row++) {
				if (!rows[row].childNodes) {continue;}
				if (rows[row].childNodes.length != 5 ) {continue;}
				var lbl = window.ff35mm.getText(rows[row].childNodes[1]);
				lbl = lbl.replace(' - ', '').replace(' -', '').toLowerCase();
				if (!window.ff35mm.v_fl && window.ff35mm.t_fl.indexOf(lbl)>=0) {
					window.ff35mm.v_fl = parseFloat(window.ff35mm.getText(rows[row].childNodes[3]));
					window.ff35mm.x_fov = document.createElement(tag1);
					var new_th = document.createElement(tag2);
					var new_td = document.createElement(tag3);
					new_th.innerHTML = 'Field of View: ';
					new_td.innerHTML = 'unknown';
					window.ff35mm.x_fov.appendChild(new_th);
					window.ff35mm.x_fov.appendChild(new_td);
					rows[row].parentNode.insertBefore(window.ff35mm.x_fov, rows[row].nextSibling);
					window.ff35mm.x_fl = document.createElement(tag1);
					var new_th = document.createElement(tag2);
					var new_td = document.createElement(tag3);
					new_th.innerHTML = 'Focal length (35mm): ';
					new_td.innerHTML = 'unknown';
					window.ff35mm.x_fl.appendChild(new_th);
					window.ff35mm.x_fl.appendChild(new_td);
					rows[row].parentNode.insertBefore(window.ff35mm.x_fl, rows[row].nextSibling);
				}
				if (!window.ff35mm.v_fl35 && window.ff35mm.t_fl35.indexOf(lbl)>=0) {window.ff35mm.v_fl35 = parseFloat(window.ff35mm.getText(rows[row].childNodes[3]));}
				if (!window.ff35mm.v_fpd && lbl == window.ff35mm.t_fpd) {window.ff35mm.v_fpd = parseFloat(window.ff35mm.getText(rows[row].childNodes[3]));}
				if (!window.ff35mm.v_fpxs && lbl == window.ff35mm.t_fpxs) {window.ff35mm.v_fpxs = parseFloat(window.ff35mm.getText(rows[row].childNodes[3]));}
				if (!window.ff35mm.v_fpys && lbl == window.ff35mm.t_fpys) {window.ff35mm.v_fpys = parseFloat(window.ff35mm.getText(rows[row].childNodes[3]));}
				if (!window.ff35mm.v_fpxr && window.ff35mm.t_fpxr.indexOf(lbl)>=0) {window.ff35mm.v_fpxr = parseFloat(window.ff35mm.getText(rows[row].childNodes[3]));}
				if (!window.ff35mm.v_fpyr && window.ff35mm.t_fpyr.indexOf(lbl)>=0) {window.ff35mm.v_fpyr = parseFloat(window.ff35mm.getText(rows[row].childNodes[3]));}
				if (!window.ff35mm.v_fpru && lbl == window.ff35mm.t_fpru) {window.ff35mm.v_fpru = window.ff35mm.getText(rows[row].childNodes[3]);}
				if (!window.ff35mm.v_width && window.ff35mm.t_width.indexOf(lbl)>=0) {window.ff35mm.v_width = parseFloat(window.ff35mm.getText(rows[row].childNodes[3]));}
				if (!window.ff35mm.v_height && window.ff35mm.t_height.indexOf(lbl)>=0) {window.ff35mm.v_height = parseFloat(window.ff35mm.getText(rows[row].childNodes[3]));}
				if (!window.ff35mm.v_ztw && lbl == window.ff35mm.t_ztw) {window.ff35mm.v_ztw = parseFloat(window.ff35mm.getText(rows[row].childNodes[3]));}
				if (!window.ff35mm.v_zsw && lbl == window.ff35mm.t_zsw) {window.ff35mm.v_zsw = parseFloat(window.ff35mm.getText(rows[row].childNodes[3]));}
			}
		}
		this.outputResult = function() {
			if (window.ff35mm.v_fl35 && window.ff35mm.v_fl) {
				window.ff35mm.x_fl.childNodes[1].innerHTML = '<b>'+ window.ff35mm.v_fl35 +'mm ('+ Math.round(window.ff35mm.v_fl35/window.ff35mm.v_fl*10)/10 +'x)</b>';
				var fov = window.ff35mm.calcAFOV(window.ff35mm.v_fl35, window.ff35mm.c_w, window.ff35mm.c_h, window.ff35mm.c_fpd35);
				window.ff35mm.x_fov.childNodes[1].innerHTML = '<b>'+ fov[0] +'° / '+ fov[1] +'° / '+ fov[2] +'°</b>';
			}
			else if (window.ff35mm.v_fl) {
				var cf;
				var message;
				if (window.ff35mm.v_fpd) {
					cf = window.ff35mm.cfbydiagonal(window.ff35mm.c_fpd35, window.ff35mm.v_fpd);
					message = 'diagonal';
				}
				else if (window.ff35mm.v_fpxs && window.ff35mm.v_fpys && window.ff35mm.v_width && window.ff35mm.v_height && window.ff35mm.v_fpxr && window.ff35mm.v_fpyr) {
					var resized = window.ff35mm.check_resize(window.ff35mm.v_width, window.ff35mm.v_height, window.ff35mm.v_ztw, window.ff35mm.v_zsw);
					cf = window.ff35mm.cfbyresolution(window.ff35mm.c_fpd35, window.ff35mm.v_width*resized, window.ff35mm.v_height*resized, window.ff35mm.v_fpxr, window.ff35mm.v_fpyr, window.ff35mm.v_fpru);
					message = ((resized>1) ? 'corrected ': '') +'resolution (over size)';
					if (cf < 1) {
						cf = window.ff35mm.cfbysize(window.ff35mm.c_fpd35, window.ff35mm.v_fpxs, window.ff35mm.v_fpys);
						message = 'size (over resolution)';
					}
				}
				else if (window.ff35mm.v_width && window.ff35mm.v_height && window.ff35mm.v_fpxr && window.ff35mm.v_fpyr) {
					var resized = window.ff35mm.check_resize(window.ff35mm.v_width, window.ff35mm.v_height, window.ff35mm.v_ztw, window.ff35mm.v_zsw);
					cf = window.ff35mm.cfbyresolution(window.ff35mm.c_fpd35, window.ff35mm.v_width*resized, window.ff35mm.v_height*resized, window.ff35mm.v_fpxr, window.ff35mm.v_fpyr, window.ff35mm.v_fpru);
					message = ((resized>1) ? 'corrected ': '') +'resolution';
				}
				else if (window.ff35mm.v_fpxs && window.ff35mm.v_fpys) {
					cf = window.ff35mm.cfbysize(window.ff35mm.c_fpd35, window.ff35mm.v_fpxs, window.ff35mm.v_fpys);
					message = 'size';
				}
				if (!cf) {
					/*alert('unable to calculate');*/
				}
				else {
					if (cf < 1) {
						/*alert('bigger than full frame');*/
					}
					else {
						window.ff35mm.x_fl.childNodes[1].innerHTML = '<b title="'+ message +'">'+ Math.round(cf*window.ff35mm.v_fl) +'mm ('+ cf +'x)</b>';
						var fov = window.ff35mm.calcAFOV(Math.round(cf*window.ff35mm.v_fl), window.ff35mm.c_w, window.ff35mm.c_h, window.ff35mm.c_fpd35);
						window.ff35mm.x_fov.childNodes[1].innerHTML = '<b>'+ fov[0] +'° / '+ fov[1] +'° / '+ fov[2] +'°</b>';
					}
				}
			}
		}
		this.calcAFOV = function(lensSize, sensorWidth, sensorHeight, sensorDiagonal) {
			var hFovAngle = 2 * Math.atan(sensorWidth/(2*lensSize))*180/Math.PI;
			var vFovAngle = 2 * Math.atan(sensorHeight/(2*lensSize))*180/Math.PI;
			var dFovAngle = 2 * Math.atan(sensorDiagonal/(2*lensSize))*180/Math.PI;
			return [Math.round(hFovAngle*10)/10, Math.round(vFovAngle*10)/10, Math.round(dFovAngle*10)/10];
		}
		this.cfbydiagonal = function(c_fpd35, v_fpd) {
			return Math.round(c_fpd35/v_fpd*10)/10;
		}
		this.cfbysize = function(c_fpd35, v_fpxs, v_fpys) {
			var xsize = Math.round(v_fpxs);
			var ysize = Math.round(v_fpys);
			return window.ff35mm.cfbydiagonal(c_fpd35, Math.sqrt(xsize*xsize+ysize*ysize));
		}
		this.cfbyresolution = function(c_fpd35, v_width, v_height, v_fpxr, v_fpyr, v_fpru) {
			var conv = 25.4;
			if (v_fpru == 'cm') {conv = 10;}
			var longest = v_fpxr; var shortest = v_fpyr;
			if (v_width < v_height) {shortest = v_fpxr; longest = v_fpyr;}
			return window.ff35mm.cfbysize(c_fpd35, v_width/(longest/conv), v_height/(shortest/conv));
		}
		this.check_resize = function(v_width, v_height, v_ztw, v_zsw) {
			var resized = 1;
			var longest = v_width;
			if (v_height > v_width) {longest = v_height;}
			if (v_width < v_ztw) {resized = v_ztw/longest;}
			else if (v_width < v_zsw) {resized = v_zsw/longest;}
			return resized;
		}
		this.getText = function(element) {
			if (element.innerText) {return element.innerText;}
			else if (element.textContent) {return element.textContent;}
			else if (element.getAttribute("title")) {return element.getAttribute("title");}
			else {return '';}
		}
	}
	wnd.ff35mm = new ff35mm();

	wnd.ff35mm.parseHtml('tr', 'th', 'td');
	if (wnd.ff35mm.x_fl && wnd.ff35mm.x_fov) {
		wnd.ff35mm.outputResult();
	}
	else
	{
		setTimeout(function() {
			window.ff35mm.parseHtml('li', 'span', 'span');
			if (window.ff35mm.x_fl && window.ff35mm.x_fov) {
				window.ff35mm.outputResult();
			}
		}, 5000);
	}
})(window);

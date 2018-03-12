function govspeakBarcharts() {
    $(".govuk-govspeak .js-barchart-table").each(function () {
        $.magnaCharta($(this), {
            toggleText: "Change between chart and table"
        })
    })
}! function (t) {
    var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        i = function (t) {
            t = t.replace(/\x0d\x0a/g, "\n");
            for (var e = "", i = 0; i < t.length; i++) {
                var n = t.charCodeAt(i);
                n < 128 ? e += String.fromCharCode(n) : n > 127 && n < 2048 ? (e += String.fromCharCode(n >> 6 | 192), e += String.fromCharCode(63 & n | 128)) : (e += String.fromCharCode(n >> 12 | 224), e += String.fromCharCode(n >> 6 & 63 | 128), e += String.fromCharCode(63 & n | 128))
            }
            return e
        },
        n = function (t) {
            for (var e = "", i = 0, n = c1 = c2 = 0; i < t.length;)(n = t.charCodeAt(i)) < 128 ? (e += String.fromCharCode(n), i++) : n > 191 && n < 224 ? (c2 = t.charCodeAt(i + 1), e += String.fromCharCode((31 & n) << 6 | 63 & c2), i += 2) : (c2 = t.charCodeAt(i + 1), c3 = t.charCodeAt(i + 2), e += String.fromCharCode((15 & n) << 12 | (63 & c2) << 6 | 63 & c3), i += 3);
            return e
        };
    t.extend({
        base64Encode: function (t) {
            var n, a, o, s, r, l, c, d = "",
                u = 0;
            for (t = i(t); u < t.length;) s = (n = t.charCodeAt(u++)) >> 2, r = (3 & n) << 4 | (a = t.charCodeAt(u++)) >> 4, l = (15 & a) << 2 | (o = t.charCodeAt(u++)) >> 6, c = 63 & o, isNaN(a) ? l = c = 64 : isNaN(o) && (c = 64), d = d + e.charAt(s) + e.charAt(r) + e.charAt(l) + e.charAt(c);
            return d
        },
        base64Decode: function (t) {
            var i, a, o, s, r, l, c = "",
                d = 0;
            for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); d < t.length;) i = e.indexOf(t.charAt(d++)) << 2 | (s = e.indexOf(t.charAt(d++))) >> 4, a = (15 & s) << 4 | (r = e.indexOf(t.charAt(d++))) >> 2, o = (3 & r) << 6 | (l = e.indexOf(t.charAt(d++))), c += String.fromCharCode(i), 64 != r && (c += String.fromCharCode(a)), 64 != l && (c += String.fromCharCode(o));
            return c = n(c)
        }
    })
}(jQuery), Function.prototype.bind || (Function.prototype.bind = function (t) {
        if ("function" != typeof this) throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        var e = Array.prototype.slice.call(arguments, 1),
            i = this,
            n = function () {},
            a = function () {
                return i.apply(this instanceof n && t ? this : t, e.concat(Array.prototype.slice.call(arguments)))
            };
        return n.prototype = this.prototype, a.prototype = new n, a
    }),
    function (t) {
        "use strict";

        function e() {
            "function" == typeof t.ga && t.ga.apply(t, arguments)
        }
        var i = t.jQuery,
            n = t.GOVUK || {},
            a = function (t, i) {
                function n() {
                    e("create", t, i)
                }

                function a() {
                    e("set", "anonymizeIp", !0)
                }

                function o() {
                    e("set", "displayFeaturesTask", null)
                }
                "string" == typeof i && (i = {
                    cookieDomain: i
                }), n(), a(), o()
            };
        a.load = function () {
            var e, i, n, a, o, s, r;
            e = t, i = document, n = "script", a = "https://www.google-analytics.com/analytics.js", o = "ga", e.GoogleAnalyticsObject = o, e[o] = e[o] || function () {
                (e[o].q = e[o].q || []).push(arguments)
            }, e[o].l = 1 * new Date, s = i.createElement(n), r = i.getElementsByTagName(n)[0], s.async = 1, s.src = a, r.parentNode.insertBefore(s, r)
        }, a.prototype.trackPageview = function (t, n, a) {
            var o;
            "string" == typeof t && (o = {
                page: t
            }), "string" == typeof n && ((o = o || {}).title = n), "object" == typeof a && (o = i.extend(o || {}, a)), i.isEmptyObject(o) ? e("send", "pageview") : e("send", "pageview", o)
        }, a.prototype.trackEvent = function (t, n, a) {
            var o, s = {
                hitType: "event",
                eventCategory: t,
                eventAction: n
            };
            "string" == typeof (a = a || {}).label && (s.eventLabel = a.label, delete a.label), (a.value || 0 === a.value) && ("number" != typeof (o = parseInt(a.value, 10)) || isNaN(o) || (a.eventValue = o), delete a.value), a.nonInteraction && (a.nonInteraction = 1), "object" == typeof a && i.extend(s, a), e("send", s)
        }, a.prototype.trackSocial = function (t, n, a, o) {
            var s = {
                hitType: "social",
                socialNetwork: t,
                socialAction: n,
                socialTarget: a
            };
            i.extend(s, o), e("send", s)
        }, a.prototype.addLinkedTrackerDomain = function (t, i, n) {
            e("create", t, "auto", {
                name: i
            }), e("require", "linker"), e(i + ".require", "linker"), e("linker:autoLink", [n]), e(i + ".linker:autoLink", [n]), e(i + ".set", "anonymizeIp", !0), e(i + ".set", "displayFeaturesTask", null), e(i + ".send", "pageview")
        }, a.prototype.setDimension = function (t, i) {
            e("set", "dimension" + t, String(i))
        }, n.GoogleAnalyticsUniversalTracker = a, t.GOVUK = n
    }(window),
    function (t) {
        "use strict";
        var e = t.jQuery,
            i = t.GOVUK || {},
            n = function (t) {
                this.gifUrl = t, this.dimensions = []
            };
        n.load = function () {}, n.prototype.trackPageview = function (t, i, n) {
            var a;
            "string" == typeof t && (a = {
                page: t
            }), "string" == typeof i && ((a = a || {}).title = i), "object" == typeof n && (a = e.extend(a || {}, n)), e.isEmptyObject(a) ? this.sendToTracker("pageview") : this.sendToTracker("pageview", a)
        }, n.prototype.trackEvent = function (t, i, n) {
            var a = {
                eventCategory: t,
                eventAction: i
            };
            (n = n || {}).label && (a.eventLabel = n.label, delete n.label), n.value && (a.eventValue = n.value.toString(), delete n.value), "object" == typeof n && e.extend(a, n), this.sendToTracker("event", a)
        }, n.prototype.trackSocial = function (t, i, n, a) {
            var o = {
                socialNetwork: t,
                socialAction: i,
                socialTarget: n
            };
            e.extend(o, a), this.sendToTracker("social", o)
        }, n.prototype.addLinkedTrackerDomain = function () {}, n.prototype.setDimension = function (t, e) {
            this.dimensions["dimension" + t] = e
        }, n.prototype.payloadParams = function (i, n) {
            var a = e.extend({}, n, this.dimensions, {
                eventType: i,
                referrer: t.document.referrer,
                gaClientId: this.gaClientId,
                windowWidth: t.innerWidth,
                windowHeight: t.innerHeight,
                screenWidth: t.screen.width,
                screenHeight: t.screen.height,
                colorDepth: t.screen.colorDepth
            });
            if (t.performance)
                for (var o in a.navigationType = t.performance.navigation.type.toString(), a.redirectCount = t.performance.navigation.redirectCount.toString(), t.performance.timing) {
                    var s = t.performance.timing[o];
                    "string" != typeof s && "number" != typeof s || (a["timing_" + o] = s.toString())
                }
            return a
        }, n.prototype.sendData = function (t) {
            var i = this.gifUrl + "?" + e.param(t);
            e.get(i)
        }, n.prototype.sendToTracker = function (i, n) {
            e(t.document).ready(function () {
                t.ga ? t.ga(function (t) {
                    this.gaClientId = t.get("clientId"), this.sendData(this.payloadParams(i, n))
                }.bind(this)) : this.sendData(this.payloadParams(i, n))
            }.bind(this))
        }, i.GOVUKTracker = n, t.GOVUK = i
    }(window),
    function (t) {
        "use strict";
        var e = t.GOVUK || {},
            i = /[^\s=/?&]+(?:@|%40)[^\s=/?&]+/g,
            n = /[A-PR-UWYZ][A-HJ-Z]?[0-9][0-9A-HJKMNPR-Y]?(?:[\s+]|%20)*[0-9][ABD-HJLNPQ-Z]{2}/gi,
            a = function (t) {
                if (this.stripPostcodePII = !1, "undefined" != typeof t.stripPostcodePII && (this.stripPostcodePII = !0 === t.stripPostcodePII, delete t.stripPostcodePII), this.trackers = [], "undefined" != typeof t.universalId) {
                    var i = t.universalId;
                    delete t.universalId, this.trackers.push(new e.GoogleAnalyticsUniversalTracker(i, t))
                }
                if ("undefined" != typeof t.govukTrackerUrl) {
                    var n = t.govukTrackerUrl;
                    delete t.govukTrackerUrl, this.trackers.push(new e.GOVUKTracker(n))
                }
            },
            o = function (t) {
                this.value = t
            };
        a.PIISafe = o, a.prototype.stripPII = function (t) {
            return "string" == typeof t ? this.stripPIIFromString(t) : "[object Array]" === Object.prototype.toString.call(t) || "[object Arguments]" === Object.prototype.toString.call(t) ? this.stripPIIFromArray(t) : "object" == typeof t ? this.stripPIIFromObject(t) : t
        }, a.prototype.stripPIIFromString = function (t) {
            var e = t.replace(i, "[email]");
            return !0 === this.stripPostcodePII ? e.replace(n, "[postcode]") : e
        }, a.prototype.stripPIIFromObject = function (t) {
            if (t instanceof a.PIISafe) return t.value;
            for (var e in t) {
                var i = t[e];
                t[e] = this.stripPII(i)
            }
            return t
        }, a.prototype.stripPIIFromArray = function (t) {
            for (var e = 0, i = t.length; e < i; e++) {
                var n = t[e];
                t[e] = this.stripPII(n)
            }
            return t
        }, a.prototype.sendToTrackers = function (t, e) {
            for (var i = 0, n = this.trackers.length; i < n; i++) {
                var a = this.trackers[i],
                    o = a[t];
                "function" == typeof o && o.apply(a, e)
            }
        }, a.load = function () {
            e.GoogleAnalyticsUniversalTracker.load(), e.GOVUKTracker.load()
        }, a.prototype.defaultPathForTrackPageview = function (t) {
            return this.stripPIIFromString(t.href.substring(t.origin.length).split("#")[0])
        }, a.prototype.trackPageview = function () {
            arguments[0] = arguments[0] || this.defaultPathForTrackPageview(window.location), 0 === arguments.length && (arguments.length = 1), this.sendToTrackers("trackPageview", this.stripPII(arguments))
        }, a.prototype.trackEvent = function () {
            this.sendToTrackers("trackEvent", this.stripPII(arguments))
        }, a.prototype.trackShare = function (e, i) {
            this.sendToTrackers("trackSocial", this.stripPII([e, "share", t.location.pathname, i]))
        }, a.prototype.setDimension = function () {
            this.sendToTrackers("setDimension", this.stripPII(arguments))
        }, a.prototype.addLinkedTrackerDomain = function () {
            this.sendToTrackers("addLinkedTrackerDomain", arguments)
        }, e.Analytics = a, t.GOVUK = e
    }(window),
    function (t) {
        "use strict";
        var e = t.GOVUK || {};
        e.analyticsPlugins = e.analyticsPlugins || {}, e.analyticsPlugins.printIntent = function () {
            var i = function () {
                e.analytics.trackEvent("Print Intent", document.location.pathname), e.analytics.trackPageview("/print" + document.location.pathname)
            };
            if (t.matchMedia) {
                var n = t.matchMedia("print"),
                    a = 0;
                n.addListener(function (t) {
                    t.matches || 0 !== a || (i(), a++, setTimeout(function () {
                        a = 0
                    }, 3e3))
                })
            }
            t.onafterprint && (t.onafterprint = i)
        }, t.GOVUK = e
    }(window),
    function (t) {
        "use strict";
        var e = t.GOVUK || {};
        e.analyticsPlugins = e.analyticsPlugins || {}, e.analyticsPlugins.error = function (i) {
            function n(t) {
                return !t || !a || !!a.test(t)
            }
            var a = (i = i || {}).filenameMustMatch,
                o = function (t) {
                    var i = t.filename,
                        a = i + ": " + t.lineno;
                    n(i) && e.analytics.trackEvent("JavaScript Error", t.message, {
                        label: a,
                        value: 1,
                        nonInteraction: !0
                    })
                };
            t.addEventListener ? t.addEventListener("error", o, !1) : t.attachEvent ? t.attachEvent("onerror", o) : t.onerror = o
        }, t.GOVUK = e
    }(window),
    function (t) {
        "use strict";
        var e = t.jQuery,
            i = t.GOVUK || {};
        i.analyticsPlugins = i.analyticsPlugins || {}, i.analyticsPlugins.mailtoLinkTracker = function () {
            function t(t) {
                var a = n(t),
                    o = {
                        transport: "beacon"
                    },
                    s = a.attr("href"),
                    r = e.trim(a.text());
                r && (o.label = r), i.analytics.trackEvent("Mailto Link Clicked", s, o)
            }

            function n(t) {
                var i = e(t.target);
                return i.is("a") || (i = i.parents("a")), i
            }
            var a = 'a[href^="mailto:"]';
            e("body").on("click", a, t)
        }, t.GOVUK = i
    }(window),
    function (t) {
        "use strict";
        var e = t.jQuery,
            i = t.GOVUK || {};
        i.analyticsPlugins = i.analyticsPlugins || {}, i.analyticsPlugins.externalLinkTracker = function (t) {
            function n(t) {
                var n = a(t),
                    s = {
                        transport: "beacon"
                    },
                    r = n.attr("href"),
                    l = e.trim(n.text());
                if (l && (s.label = l), o !== undefined) {
                    var c = r;
                    i.analytics.setDimension(o, c)
                }
                i.analytics.trackEvent("External Link Clicked", r, s)
            }

            function a(t) {
                var i = e(t.target);
                return i.is("a") || (i = i.parents("a")), i
            }
            var o = (t = t || {}).externalLinkUploadCustomDimension,
                s = 'a[href^="http"]:not(a[href*="' + i.analyticsPlugins.externalLinkTracker.getHostname() + '"])';
            e("body").on("click", s, n)
        }, i.analyticsPlugins.externalLinkTracker.getHostname = function () {
            return t.location.hostname
        }, t.GOVUK = i
    }(window),
    function (t) {
        "use strict";
        var e = t.jQuery,
            i = t.GOVUK || {};
        i.analyticsPlugins = i.analyticsPlugins || {}, i.analyticsPlugins.downloadLinkTracker = function (t) {
            function n(t) {
                var n = a(t),
                    o = n.attr("href"),
                    s = {
                        transport: "beacon"
                    },
                    r = e.trim(n.text());
                r && (s.label = r), i.analytics.trackEvent("Download Link Clicked", o, s)
            }

            function a(t) {
                var i = e(t.target);
                return i.is("a") || (i = i.parents("a")), i
            }
            var o = (t = t || {}).selector;
            o && e("body").on("click", o, n)
        }, t.GOVUK = i
    }(window),
    function () {
        "use strict";

        function t() {
            return $('meta[name="govuk:rendering-application"]').attr("content")
        }

        function e() {
            return $('meta[name="govuk:format"]').attr("content")
        }

        function i() {
            return $('meta[name="govuk:navigation-page-type"]').attr("content")
        }

        function n() {
            return "collections" == t() && "taxon" == e() && "grid" == i()
        }

        function a() {
            return "collections" == t() && "taxon" == e() && "accordion" == i()
        }

        function o() {
            return "collections" == t() && "taxon" == e() && "leaf" == i()
        }

        function s() {
            return "collections" == t() && "mainstream_browse_page" == e()
        }

        function r() {
            return "collections" == t() && "topic" == e()
        }

        function l() {
            return "whitehall" == t() && "placeholder_policy_area" == e()
        }

        function c() {
            return "government-frontend" == t() && "document_collection" == e()
        }

        function d() {
            return "finder-frontend" == t() && "finder" == e()
        }

        function u() {
            return "whitehall" == t() && "finder" == e()
        }
        window.GOVUK = window.GOVUK || {};
        var h = function () {};
        h.getNumberOfSections = function () {
            switch (!0) {
                case n():
                    return 1 + $(".parent-topic-contents").length;
                case a():
                    return $('[data-track-count="accordionSection"]').length;
                case c():
                    return $(".document-collection .group-title").length;
                case s():
                    return $("#subsection ul:visible").length || $("#section ul").length;
                case r():
                    return $(".topics-page nav.index-list").length;
                case l():
                    return $(".topic section h1.label").length;
                case d():
                case u():
                case o():
                    return 1;
                default:
                    var t = $('[data-track-count="sidebarRelatedItemSection"]').length,
                        e = $('[data-track-count="sidebarTaxonSection"]').length;
                    return t || e
            }
        }, h.getNumberOfLinks = function () {
            switch (!0) {
                case n():
                    return $('a[data-track-category="navGridLinkClicked"]').length + $('a[data-track-category="navGridLeafLinkClicked"]').length;
                case a():
                    return $('a[data-track-category="navAccordionLinkClicked"]').length;
                case o():
                    return $('a[data-track-category="navLeafLinkClicked"]').length;
                case c():
                    return $(".document-collection .group-document-list li a").length;
                case s():
                    return $("#subsection ul a:visible").length || $("#section ul a").length;
                case r():
                    return $(".topics-page .index-list ul a").length || $(".topics-page .topics ul a").length;
                case l():
                    return $("section.document-block a").length + $("section .collection-list h2 a").length;
                case u():
                    return $(".document-list .document-row h3 a").length;
                case d():
                    return $(".finder-frontend-content li.document a").length;
                default:
                    return $('a[data-track-category="relatedLinkClicked"]').length
            }
        }, GOVUK.PageContent = h
    }(),
    function () {
        "use strict";

        function t() {
            var t = {
                dimension15: window.httpStatusCode || 200,
                dimension16: GOVUK.cookie("TLSversion") || "unknown",
                dimension95: GOVUK.analytics.gaClientId
            };
            return window.devicePixelRatio && (t.dimension11 = window.devicePixelRatio), t
        }

        function e() {
            var t = {
                    section: {
                        dimension: 1
                    },
                    format: {
                        dimension: 2
                    },
                    themes: {
                        dimension: 3,
                        defaultValue: "other"
                    },
                    "content-id": {
                        dimension: 4,
                        defaultValue: "00000000-0000-0000-0000-000000000000"
                    },
                    "search-result-count": {
                        dimension: 5
                    },
                    "publishing-government": {
                        dimension: 6
                    },
                    "political-status": {
                        dimension: 7
                    },
                    "analytics:organisations": {
                        dimension: 9
                    },
                    "analytics:world-locations": {
                        dimension: 10
                    },
                    withdrawn: {
                        dimension: 12,
                        defaultValue: "not withdrawn"
                    },
                    "schema-name": {
                        dimension: 17
                    },
                    "rendering-application": {
                        dimension: 20
                    },
                    "navigation-page-type": {
                        dimension: 32,
                        defaultValue: "none"
                    },
                    "user-journey-stage": {
                        dimension: 33,
                        defaultValue: "thing"
                    },
                    "navigation-document-type": {
                        dimension: 34,
                        defaultValue: "other"
                    },
                    "taxon-slug": {
                        dimension: 56,
                        defaultValue: "other"
                    },
                    "taxon-id": {
                        dimension: 57,
                        defaultValue: "other"
                    },
                    "taxon-slugs": {
                        dimension: 58,
                        defaultValue: "other"
                    },
                    "taxon-ids": {
                        dimension: 59,
                        defaultValue: "other"
                    },
                    "content-has-history": {
                        dimension: 39,
                        defaultValue: "false"
                    },
                    "navigation-legacy": {
                        dimension: 30,
                        defaultValue: "none"
                    }
                },
                e = $('meta[name^="govuk:"]'),
                i = {},
                n = {};
            return e.each(function () {
                var e = $(this),
                    i = e.attr("name").split("govuk:")[1];
                t[i] && (n[i] = e.attr("content"))
            }), $.each(t, function (t, e) {
                var a = n[t] || e.defaultValue;
                void 0 !== a && (i["dimension" + e.dimension] = a)
            }), i
        }

        function i() {
            return {
                dimension26: GOVUK.PageContent.getNumberOfSections(),
                dimension27: GOVUK.PageContent.getNumberOfLinks(),
                dimension23: $('main[id="content"]').attr("lang") || "unknown"
            }
        }

        function n() {
            var t = $('meta[name^="govuk:ab-test"]'),
                e = {};
            return t.each(function () {
                var t = $(this),
                    i = parseInt(t.data("analytics-dimension")),
                    n = t.attr("content");
                i && (e["dimension" + i] = n)
            }), e
        }
        window.GOVUK = window.GOVUK || {};
        var a = function () {};
        a.getAndExtendDefaultTrackingOptions = function (t) {
            var e = this.customDimensions();
            return $.extend(e, t)
        }, a.customDimensions = function () {
            var a = $.extend({}, t(), e(), i(), n());
            return $.each(a, function (t, e) {
                a[t] = new GOVUK.Analytics.PIISafe(String(e))
            })
        }, GOVUK.CustomDimensions = a
    }(),
    function () {
        "use strict";

        function t() {
            try {
                var t = e.prototype.getCookie("analytics_next_page_call");
                return e.prototype.setCookie("analytics_next_page_call", null), t || {}
            } catch (i) {
                return {}
            }
        }
        window.GOVUK = window.GOVUK || {};
        var e = function (e) {
            "undefined" == typeof e.stripPostcodePII && (e.stripPostcodePII = $('meta[name="govuk:static-analytics:strip-postcodes"]').length > 0), this.analytics = new GOVUK.Analytics(e);
            var i = t();
            ga(function (t) {
                this.gaClientId = t.get("clientId"), $(window).trigger("gaClientSet"), this.trackPageview(null, null, i), GOVUK.analyticsPlugins.error({
                    filenameMustMatch: /gov\.uk/
                }), GOVUK.analyticsPlugins.printIntent(), GOVUK.analyticsPlugins.mailtoLinkTracker(), GOVUK.analyticsPlugins.externalLinkTracker({
                    externalLinkUploadCustomDimension: 36
                }), GOVUK.analyticsPlugins.downloadLinkTracker({
                    selector: 'a[href*="/government/uploads"], a[href*="assets.publishing.service.gov.uk"]'
                })
            }.bind(this))
        };
        e.load = function () {
            GOVUK.Analytics.load()
        }, e.prototype.trackPageview = function (t, e, i) {
            GOVUK.Ecommerce.start();
            var n = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions(i);
            this.analytics.trackPageview(t, e, n)
        }, e.prototype.trackEvent = function (t, e, i) {
            var n = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions(i);
            this.analytics.trackEvent(t, e, n)
        }, e.prototype.setDimension = function (t, e, i, n) {
            void 0 !== e && this.analytics.setDimension(t, e, i, n)
        }, e.prototype.trackShare = function (t) {
            var e = GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions();
            this.analytics.trackShare(t, e)
        }, e.prototype.addLinkedTrackerDomain = function (t, e, i) {
            this.analytics.addLinkedTrackerDomain(t, e, i)
        }, e.prototype.setOptionsForNextPageview = function (e) {
            if ("object" == typeof e) {
                var i = t();
                $.extend(i, e), this.setCookie("analytics_next_page_call", i)
            }
        }, e.prototype.setCookie = function (t, e) {
            GOVUK.cookie && (e ? GOVUK.cookie(t, JSON.stringify(JSON.stringify(e))) : GOVUK.cookie(t, null))
        }, e.prototype.getCookie = function (t) {
            if (GOVUK.cookie) try {
                return JSON.parse(JSON.parse(GOVUK.cookie(t)))
            } catch (e) {
                return null
            }
        }, e.prototype.stripPII = function (t) {
            return this.analytics.stripPII(t)
        }, GOVUK.StaticAnalytics = e
    }(),
    function () {
        "use strict";
        window.GOVUK = window.GOVUK || {};
        var t = function () {
            function t(t, e, i, n) {
                ga("ec:addImpression", {
                    id: t || e,
                    position: i,
                    list: "Site search results",
                    dimension71: n
                })
            }

            function e(t, e, i, n, a) {
                t.click(function () {
                    ga("ec:addProduct", {
                        id: e || i,
                        position: n,
                        dimension71: a
                    }), ga("ec:setAction", "click", {
                        list: "Site search results"
                    }), GOVUK.analytics.trackEvent("UX", "click", GOVUK.CustomDimensions.getAndExtendDefaultTrackingOptions({
                        label: "Results"
                    }))
                })
            }
            this.init = function (i) {
                var n = GOVUK.analytics.stripPII(i.attr("data-search-query")).substring(0, 100).toLowerCase(),
                    a = i.find("[data-ecommerce-row]"),
                    o = parseInt(i.data("ecommerce-start-index"), 10);
                a.each(function (i, a) {
                    var s = $(a),
                        r = s.attr("data-ecommerce-content-id"),
                        l = s.attr("data-ecommerce-path");
                    t(r, l, i + o, n), e(s, r, l, i + o, n)
                })
            }
        };
        t.ecLoaded = !1, t.start = function (e) {
            (e = e || $("[data-analytics-ecommerce]")).length > 0 && (t.ecLoaded || (ga("require", "ec"), t.ecLoaded = !0), (new t).init(e))
        }, GOVUK.Ecommerce = t
    }(),
    function (t) {
        "use strict";
        /*GOVUK.StaticAnalytics.load();
        var e = "www.gov.uk" == document.domain ? ".www.gov.uk" : document.domain,
            i = "UA-26179049-1",
            n = new GOVUK.StaticAnalytics({
                universalId: i,
                cookieDomain: e,
                allowLinker: !0,
                govukTrackerUrl: "/static/a"
            });
        if (GOVUK.analytics = n, t.ga) {
            var a = t.ga;
            a("require", "linker"), a("linker:autoLink", ["planforbritain.gov.uk"])
        }*/
    }(window),
    function () {
        "use strict";

        function t(t) {
            this.config = this.getConfigForCurrentPath(t), this.SCROLL_TIMEOUT_DELAY = 10, this.config ? (this.enabled = !0, this.trackedNodes = this.buildNodes(this.config), $(window).scroll($.proxy(this.onScroll, this)), this.trackVisibleNodes()) : this.enabled = !1
        }
        window.GOVUK = window.GOVUK || {};
        var e = {
            "/guidance/saving-for-retirement-if-youre-aged-16-to-50": [
                ["Heading", "Keep track of your State Pension"],
                ["Heading", "Consider ways to improve your State Pension"],
                ["Heading", "Personal and stakeholder pensions"]
            ],
            "/guidance/planning-for-retirement-if-youre-aged-50-or-over": [
                ["Heading", "Find out your State Pension age"],
                ["Heading", "Consider ways to improve your State Pension"],
                ["Heading", "Workplace, personal and stakeholder pensions"],
                ["Heading", "Personal and stakeholder pensions"]
            ],
            "/guidance/retirement-planning-for-current-pensioners": [
                ["Heading", "If you reached State Pension age before 6 April 2016"],
                ["Heading", "Other ways to increase your income in retirement"],
                ["Heading", "Further support in retirement"],
                ["Heading", "Winter Fuel Payments"]
            ],
            "/government/collections/disability-confident-campaign": [
                ["Heading", "Become a Disability Confident employer"],
                ["Heading", "Aims and objectives"],
                ["Heading", "Inclusive communication"]
            ],
            "/government/publications/the-essential-trustee-what-you-need-to-know-cc3/the-essential-trustee-what-you-need-to-know-what-you-need-to-do": [
                ["Heading", "1. About this guidance"],
                ["Heading", "2. Trustees\u2019 duties at a glance"],
                ["Heading", "3. Who can be a trustee and how trustees are appointed"],
                ["Heading", "4. Ensure your charity is carrying out its purposes for the public benefit"],
                ["Heading", "5. Comply with your charity\u2019s governing document and the law"],
                ["Heading", "6. Act in your charity\u2019s best interests"],
                ["Heading", "7. Manage your charity\u2019s resources responsibly"],
                ["Heading", "8. Act with reasonable care and skill"],
                ["Heading", "9. Ensure your charity is accountable"],
                ["Heading", "10. Reduce the risk of liability"],
                ["Heading", "11. Your charity\u2019s legal structure and what it means"],
                ["Heading", "12. Charity officers - the chair and treasurer"],
                ["Heading", "13. Technical terms used in this guidance"]
            ],
            "/guidance/universal-credit-how-it-helps-you-into-work": [
                ["Heading", "Support from your work coach"],
                ["Heading", "Help available for parents"],
                ["Heading", "When you can claim Universal Credit"],
                ["Heading", "More detailed advice"]
            ],
            "/openingupwork": [
                ["Heading", "How Universal Credit makes work pay"],
                ["Heading", "When you can claim Universal Credit"],
                ["Heading", "Help and advice"]
            ],
            "/government/publications/spring-budget-2017-documents/spring-budget-2017": [
                ["Heading", "1. Executive summary"],
                ["Heading", "2. Economic context and public finances"],
                ["Heading", "3. Policy decisions"],
                ["Heading", "4. Tax"],
                ["Heading", "5. Productivity"],
                ["Heading", "6. Public services and markets"],
                ["Heading", "7. Annex A: Financing"],
                ["Heading", "8. Annex B: Office for Budget Responsibility's Economic and fiscal outlook"]
            ]
        };
        t.prototype.getConfigForCurrentPath = function (t) {
            for (var e in t)
                if (this.normalisePath(window.location.pathname) == this.normalisePath(e)) return t[e]
        }, t.prototype.buildNodes = function (e) {
            for (var i, n, a = [], o = 0; o < e.length; o++) i = t[e[o][0] + "Node"], n = e[o][1], a.push(new i(n));
            return a
        }, t.prototype.normalisePath = function (t) {
            return t.split("/").join("")
        }, t.prototype.onScroll = function () {
            clearTimeout(this.scrollTimeout), this.scrollTimeout = setTimeout($.proxy(this.trackVisibleNodes, this), this.SCROLL_TIMEOUT_DELAY)
        }, t.prototype.trackVisibleNodes = function () {
            for (var t = 0; t < this.trackedNodes.length; t++)
                if (this.trackedNodes[t].isVisible() && !this.trackedNodes[t].alreadySeen) {
                    this.trackedNodes[t].alreadySeen = !0;
                    var e = this.trackedNodes[t].eventData.action,
                        i = this.trackedNodes[t].eventData.label;
                    GOVUK.analytics.trackEvent("ScrollTo", e, {
                        label: i,
                        nonInteraction: !0
                    })
                }
        }, t.HeadingNode = function (t) {
            function e(t) {
                for (var e = $("h1, h2, h3, h4, h5, h6"), i = 0; i < e.length; i++)
                    if ($.trim(e.eq(i).text()).replace(/\s/g, " ") == t) return e.eq(i)
            }
            this.$element = e(t), this.eventData = {
                action: "Heading",
                label: t
            }
        }, t.HeadingNode.prototype.isVisible = function () {
            return !!this.$element && this.elementIsVisible(this.$element)
        }, t.HeadingNode.prototype.elementIsVisible = function (t) {
            var e = $(window),
                i = t.offset().top;
            return i > e.scrollTop() && i < e.scrollTop() + e.height()
        }, $().ready(function () {
            window.GOVUK.scrollTracker = new t(e)
        }), window.GOVUK.ScrollTracker = t
    }(),
    function (t) {
        "use strict";
        var e = t.jQuery,
            i = t.GOVUK || {};
        i.Modules = i.Modules || {}, i.modules = {
            find: function (t) {
                var i, n = "[data-module]";
                return i = (t = t || e("body")).find(n), t.is(n) && (i = i.add(t)), i
            },
            start: function (t) {
                function n(t) {
                    return o(a(t))
                }

                function a(t) {
                    return t.replace(/-([a-z])/g, function (t) {
                        return t.charAt(1).toUpperCase()
                    })
                }

                function o(t) {
                    return t.charAt(0).toUpperCase() + t.slice(1)
                }
                for (var s = this.find(t), r = 0, l = s.length; r < l; r++) {
                    var c = e(s[r]),
                        d = n(c.data("module")),
                        u = c.data("module-started");
                    "function" != typeof i.Modules[d] || u || ((new i.Modules[d]).start(c), c.data("module-started", !0))
                }
            }
        }, t.GOVUK = i
    }(window),
    function (t, e) {
        "use strict";
        var i = (0, e.$)(e);
        t.StickyElementContainer = function () {
            var t = this;
            t._getWindowDimensions = function () {
                return {
                    height: i.height(),
                    width: i.width()
                }
            }, t._getWindowPositions = function () {
                return {
                    scrollTop: i.scrollTop()
                }
            }, t.start = function (e) {
                function n() {
                    i.resize(a), i.scroll(o), setInterval(s, w), setInterval(r, w), s(), r(), m.addClass("govuk-sticky-element--enabled")
                }

                function a() {
                    v = !0
                }

                function o() {
                    y = !0
                }

                function s() {
                    if (v) {
                        v = !1, y = !0;
                        var i = t._getWindowDimensions();
                        f = e.offset().top, g = e.offset().top + e.height() - i.height
                    }
                }

                function r() {
                    y && (y = !1, b = t._getWindowPositions().scrollTop, l(), c())
                }

                function l() {
                    f < b ? h() : p()
                }

                function c() {
                    g < b ? u() : d()
                }

                function d() {
                    m.addClass("govuk-sticky-element--stuck-to-window")
                }

                function u() {
                    m.removeClass("govuk-sticky-element--stuck-to-window")
                }

                function h() {
                    m.removeClass("govuk-sticky-element--hidden")
                }

                function p() {
                    m.addClass("govuk-sticky-element--hidden")
                }
                var f, g, m = e.find("[data-sticky-element]"),
                    v = !0,
                    y = !0,
                    w = 50,
                    b = 1;
                n()
            }
        }
    }(window.GOVUK.Modules, window),
    function () {
        "use strict";
        window.GOVUK.Modules.Toggle = function () {
            this.start = function (t) {
                function e() {
                    var t = $(this);
                    t.attr("role", "button"), t.attr("aria-controls", t.data("controls")), t.attr("aria-expanded", t.data("expanded"));
                    var e = n(t);
                    e.attr("aria-live", "polite"), e.attr("role", "region"), t.data("$targets", e)
                }

                function i(t) {
                    var e = $(t.target),
                        i = "true" === e.attr("aria-expanded"),
                        n = e.data("$targets");
                    i ? (e.attr("aria-expanded", !1), n.addClass("js-hidden")) : (e.attr("aria-expanded", !0), n.removeClass("js-hidden"));
                    var a = e.data("toggled-text");
                    "string" == typeof a && (e.data("toggled-text", e.text()), e.text(a)), t.preventDefault()
                }

                function n(e) {
                    var i = "#" + e.attr("aria-controls").split(" ").join(", #");
                    return t.find(i)
                }
                var a = "[data-controls][data-expanded]";
                t.on("click", a, i), t.find(a).each(e)
            }
        }
    }(),
    function () {
        "use strict";
        window.GOVUK.Modules.ToggleInputClassOnFocus = function () {
            this.start = function (t) {
                function e() {
                    return "" === a.val()
                }

                function i() {
                    a.addClass("focus")
                }

                function n() {
                    e() && a.removeClass("focus")
                }
                var a = t.find(".js-class-toggle");
                e() || i(), a.on("focus", i), a.on("blur", n)
            }
        }
    }(), window.GOVUK.Modules = window.GOVUK.Modules || {},
    function () {
        "use strict";
        window.GOVUK.Modules.TrackClick = function () {
            this.start = function (t) {
                function e(t) {
                    var e = $(t.target),
                        n = {
                            transport: "beacon"
                        };
                    e.is(i) || (e = e.parents(i));
                    var a = e.attr("data-track-category"),
                        o = e.attr("data-track-action"),
                        s = e.attr("data-track-label"),
                        r = e.attr("data-track-value"),
                        l = e.attr("data-track-dimension"),
                        c = e.attr("data-track-dimension-index"),
                        d = e.attr("data-track-options");
                    s && (n.label = s), r && (n.value = r), l && c && (n["dimension" + c] = l), d && $.extend(n, JSON.parse(d)), GOVUK.analytics && GOVUK.analytics.trackEvent && GOVUK.analytics.trackEvent(a, o, n)
                }
                var i = "[data-track-category][data-track-action]";
                t.is(i) ? t.on("click", e) : t.on("click", i, e)
            }
        }
    }(), window.GOVUK.Modules = window.GOVUK.Modules || {},
    function (t) {
        "use strict";
        var e = window.$;
        t.CrossDomainTracking = function () {
            function t(t) {
                var e = t.attr("data-tracking-code"),
                    i = t.attr("data-tracking-name"),
                    n = t.prop("hostname");
                "undefined" !== GOVUK.analytics && GOVUK.analytics.addLinkedTrackerDomain(e, i, n)
            }
            this.start = function (i) {
                var n = "[href][data-tracking-code][data-tracking-name]";
                i.is(n) ? t(i) : i.find(n).each(function () {
                    t(e(this))
                })
            }
        }
    }(window.GOVUK.Modules), $(document).ready(function () {
        GOVUK.modules.start()
    }), $(document).ready(function () {
        $(".print-link a").attr("target", "_blank");
        var t = $(".js-search-focus");
        if (t.each(function (t, e) {
                "" !== $(e).val() && $(e).addClass("focus")
            }), t.on("focus", function (t) {
                $(t.target).addClass("focus")
            }), t.on("blur", function (t) {
                "" === $(t.target).val() && $(t.target).removeClass("focus")
            }), window.GOVUK) {
            var e = "label.selectable input[type='radio'], label.selectable input[type='checkbox']";
            new GOVUK.SelectionButtons(e), GOVUK.shimLinksWithButtonRole && GOVUK.shimLinksWithButtonRole.init()
        }
    }),
    function () {
        "use strict";
        window.GOVUK = window.GOVUK || {};
        var t = function (t) {
            this.$form = t, t.on("submit", this.submit.bind(this)), this.appendHiddenContextInformation()
        };
        t.prototype.appendHiddenContextInformation = function () {
            this.$form.append('<input type="hidden" name="javascript_enabled" value="true"/>'), this.$form.append($('<input type="hidden" name="referrer">').val(document.referrer || "unknown"))
        }, t.prototype.hidePrompt = function () {
            this.$form.find(".error-notification").remove()
        }, t.prototype.disableSubmitButton = function () {
            this.$form.find(".button").prop("disabled", !0)
        }, t.prototype.enableSubmitButton = function () {
            this.$form.find(".button").prop("disabled", !1)
        }, t.prototype.promptUserToEnterValidData = function () {
            this.enableSubmitButton();
            var t = $('<p class="error-notification">Please enter details of what you were doing.</p>');
            this.$form.prepend(t)
        }, t.prototype.handleError = function (t, e) {
            "error" !== e && t.responseText || (422 == t.status ? this.promptUserToEnterValidData() : this.triggerError())
        }, t.prototype.setUrl = function () {
            this.$form.find("input#url").val(window.location)
        }, t.prototype.postFormViaAjax = function () {
            $.ajax({
                type: "POST",
                url: this.$form.attr("action"),
                dataType: "json",
                data: this.$form.serialize(),
                success: this.triggerSuccess.bind(this),
                error: this.handleError.bind(this),
                statusCode: {
                    500: this.triggerError.bind(this)
                }
            })
        }, t.prototype.submit = function (t) {
            this.hidePrompt(), this.setUrl(), this.disableSubmitButton(), this.postFormViaAjax(), t.preventDefault()
        }, t.prototype.triggerError = function () {
            this.$form.trigger("reportAProblemForm.error")
        }, t.prototype.triggerSuccess = function (t) {
            this.$form.trigger("reportAProblemForm.success", t)
        }, t.prototype.trackEvent = function (t) {
            GOVUK.analytics && GOVUK.analytics.trackEvent && GOVUK.analytics.trackEvent("Onsite Feedback", t, {
                label: "(not set)"
            })
        }, GOVUK.ReportAProblemForm = t
    }(),
    function () {
        "use strict";
        window.GOVUK = window.GOVUK || {};
        var t = function (t) {
            this.$container = t;
            var e = t.find("form");
            new GOVUK.ReportAProblemForm(e), e.on("reportAProblemForm.success", this.showConfirmation.bind(this)), e.on("reportAProblemForm.error", this.showError.bind(this)), t.parent().on("click", ".js-report-a-problem-toggle", this.toggleForm.bind(this)), this.addToggleLink()
        };
        t.prototype.addToggleLink = function () {
            this.$container.before('<div class="report-a-problem-toggle-wrapper js-footer"><p class="report-a-problem-toggle"><a href="" class="js-report-a-problem-toggle">Is there anything wrong with this page?</a></p></div>')
        }, t.prototype.toggleForm = function (t) {
            this.$container.toggle(), this.$container.is(":visible") ? this.trackEvent("GOVUK Open Form") : this.trackEvent("GOVUK Close Form"), $(t.target).is("a") && t.preventDefault()
        }, t.prototype.showConfirmation = function (t, e) {
            this.trackEvent("GOVUK Send Feedback"), this.$container.find(".report-a-problem-content").html(e.message)
        }, t.prototype.showError = function () {
            var t = '<h2>Sorry, we\u2019re unable to receive your message right now.</h2><p>We have other ways for you to provide feedback on the <a href="/contact">contact page</a>.</p>';
            this.$container.find(".report-a-problem-content").html(t)
        }, t.prototype.trackEvent = function (t) {
            GOVUK.analytics && GOVUK.analytics.trackEvent && GOVUK.analytics.trackEvent("Onsite Feedback", t, {
                label: "(not set)"
            })
        }, GOVUK.ReportAProblem = t, $(document).ready(function () {
            new GOVUK.ReportAProblem($(".report-a-problem-container"))
        })
    }(),
    function (t) {
        "use strict";
        var e = t.jQuery,
            i = t.GOVUK || {},
            n = function (t, i) {
                this.selectedClass = "selected", this.focusedClass = "focused", this.radioClass = "selection-button-radio", this.checkboxClass = "selection-button-checkbox", i !== undefined && e.each(i, function (t, e) {
                    this[t] = e
                }.bind(this)), "string" == typeof t ? (this.selector = t, this.setInitialState(e(this.selector))) : t !== undefined && (this.$elms = t, this.setInitialState(this.$elms)), this.addEvents()
            };
        n.prototype.addEvents = function () {
            "undefined" != typeof this.$elms ? this.addElementLevelEvents() : this.addDocumentLevelEvents()
        }, n.prototype.setInitialState = function (t) {
            t.each(function (t, i) {
                var n = e(i),
                    a = "radio" === n.attr("type") ? this.radioClass : this.checkboxClass;
                n.parent("label").addClass(a), n.is(":checked") && this.markSelected(n)
            }.bind(this))
        }, n.prototype.markFocused = function (t, e) {
            "focused" === e ? t.parent("label").addClass(this.focusedClass) : t.parent("label").removeClass(this.focusedClass)
        }, n.prototype.markSelected = function (t) {
            var i;
            "radio" === t.attr("type") ? (i = t.attr("name"), e(t[0].form).find('input[name="' + i + '"]').parent("label").removeClass(this.selectedClass), t.parent("label").addClass(this.selectedClass)) : t.is(":checked") ? t.parent("label").addClass(this.selectedClass) : t.parent("label").removeClass(this.selectedClass)
        }, n.prototype.addElementLevelEvents = function () {
            this.clickHandler = this.getClickHandler(), this.focusHandler = this.getFocusHandler({
                level: "element"
            }), this.$elms.on("click", this.clickHandler).on("focus blur", this.focusHandler)
        }, n.prototype.addDocumentLevelEvents = function () {
            this.clickHandler = this.getClickHandler(), this.focusHandler = this.getFocusHandler({
                level: "document"
            }), e(document).on("click", this.selector, this.clickHandler).on("focus blur", this.selector, this.focusHandler)
        }, n.prototype.getClickHandler = function () {
            return function (t) {
                this.markSelected(e(t.target))
            }.bind(this)
        }, n.prototype.getFocusHandler = function (t) {
            var i = "document" === t.level ? "focusin" : "focus";
            return function (t) {
                var n = t.type === i ? "focused" : "blurred";
                this.markFocused(e(t.target), n)
            }.bind(this)
        }, n.prototype.destroy = function () {
            "undefined" != typeof this.selector ? e(document).off("click", this.selector, this.clickHandler).off("focus blur", this.selector, this.focusHandler) : this.$elms.off("click", this.clickHandler).off("focus blur", this.focusHandler)
        }, i.SelectionButtons = n, t.GOVUK = i
    }(window),
    function (t, e) {
        function i(e, i) {
            var a, o, s, r = e.nodeName.toLowerCase();
            return "area" === r ? (o = (a = e.parentNode).name, !(!e.href || !o || "map" !== a.nodeName.toLowerCase()) && (!!(s = t("img[usemap=#" + o + "]")[0]) && n(s))) : (/input|select|textarea|button|object/.test(r) ? !e.disabled : "a" === r && e.href || i) && n(e)
        }

        function n(e) {
            return t.expr.filters.visible(e) && !t(e).parents().addBack().filter(function () {
                return "hidden" === t.css(this, "visibility")
            }).length
        }
        var a, o, s = 0,
            r = /^ui-id-\d+$/;
        t.ui = t.ui || {}, t.extend(t.ui, {
            version: "1.10.2",
            keyCode: {
                BACKSPACE: 8,
                COMMA: 188,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                LEFT: 37,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SPACE: 32,
                TAB: 9,
                UP: 38
            }
        }), t.fn.extend({
            focus: (a = t.fn.focus, function (e, i) {
                return "number" == typeof e ? this.each(function () {
                    var n = this;
                    setTimeout(function () {
                        t(n).focus(), i && i.call(n)
                    }, e)
                }) : a.apply(this, arguments)
            }),
            scrollParent: function () {
                var e;
                return e = t.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () {
                    return /(relative|absolute|fixed)/.test(t.css(this, "position")) && /(auto|scroll)/.test(t.css(this, "overflow") + t.css(this, "overflow-y") + t.css(this, "overflow-x"))
                }).eq(0) : this.parents().filter(function () {
                    return /(auto|scroll)/.test(t.css(this, "overflow") + t.css(this, "overflow-y") + t.css(this, "overflow-x"))
                }).eq(0), /fixed/.test(this.css("position")) || !e.length ? t(document) : e
            },
            zIndex: function (i) {
                if (i !== e) return this.css("zIndex", i);
                if (this.length)
                    for (var n, a, o = t(this[0]); o.length && o[0] !== document;) {
                        if (("absolute" === (n = o.css("position")) || "relative" === n || "fixed" === n) && (a = parseInt(o.css("zIndex"), 10), !isNaN(a) && 0 !== a)) return a;
                        o = o.parent()
                    }
                return 0
            },
            uniqueId: function () {
                return this.each(function () {
                    this.id || (this.id = "ui-id-" + ++s)
                })
            },
            removeUniqueId: function () {
                return this.each(function () {
                    r.test(this.id) && t(this).removeAttr("id")
                })
            }
        }), t.extend(t.expr[":"], {
            data: t.expr.createPseudo ? t.expr.createPseudo(function (e) {
                return function (i) {
                    return !!t.data(i, e)
                }
            }) : function (e, i, n) {
                return !!t.data(e, n[3])
            },
            focusable: function (e) {
                return i(e, !isNaN(t.attr(e, "tabindex")))
            },
            tabbable: function (e) {
                var n = t.attr(e, "tabindex"),
                    a = isNaN(n);
                return (a || n >= 0) && i(e, !a)
            }
        }), t("<a>").outerWidth(1).jquery || t.each(["Width", "Height"], function (i, n) {
            function a(e, i, n, a) {
                return t.each(o, function () {
                    i -= parseFloat(t.css(e, "padding" + this)) || 0, n && (i -= parseFloat(t.css(e, "border" + this + "Width")) || 0), a && (i -= parseFloat(t.css(e, "margin" + this)) || 0)
                }), i
            }
            var o = "Width" === n ? ["Left", "Right"] : ["Top", "Bottom"],
                s = n.toLowerCase(),
                r = {
                    innerWidth: t.fn.innerWidth,
                    innerHeight: t.fn.innerHeight,
                    outerWidth: t.fn.outerWidth,
                    outerHeight: t.fn.outerHeight
                };
            t.fn["inner" + n] = function (i) {
                return i === e ? r["inner" + n].call(this) : this.each(function () {
                    t(this).css(s, a(this, i) + "px")
                })
            }, t.fn["outer" + n] = function (e, i) {
                return "number" != typeof e ? r["outer" + n].call(this, e) : this.each(function () {
                    t(this).css(s, a(this, e, !0, i) + "px")
                })
            }
        }), t.fn.addBack || (t.fn.addBack = function (t) {
            return this.add(null == t ? this.prevObject : this.prevObject.filter(t))
        }), t("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (t.fn.removeData = (o = t.fn.removeData, function (e) {
            return arguments.length ? o.call(this, t.camelCase(e)) : o.call(this)
        })), t.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), t.support.selectstart = "onselectstart" in document.createElement("div"), t.fn.extend({
            disableSelection: function () {
                return this.bind((t.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (t) {
                    t.preventDefault()
                })
            },
            enableSelection: function () {
                return this.unbind(".ui-disableSelection")
            }
        }), t.extend(t.ui, {
            plugin: {
                add: function (e, i, n) {
                    var a, o = t.ui[e].prototype;
                    for (a in n) o.plugins[a] = o.plugins[a] || [], o.plugins[a].push([i, n[a]])
                },
                call: function (t, e, i) {
                    var n, a = t.plugins[e];
                    if (a && t.element[0].parentNode && 11 !== t.element[0].parentNode.nodeType)
                        for (n = 0; n < a.length; n++) t.options[a[n][0]] && a[n][1].apply(t.element, i)
                }
            },
            hasScroll: function (e, i) {
                if ("hidden" === t(e).css("overflow")) return !1;
                var n = i && "left" === i ? "scrollLeft" : "scrollTop",
                    a = !1;
                return e[n] > 0 || (e[n] = 1, a = e[n] > 0, e[n] = 0, a)
            }
        })
    }(jQuery),
    function (t, e) {
        var i = 0,
            n = Array.prototype.slice,
            a = t.cleanData;
        t.cleanData = function (e) {
            for (var i, n = 0; null != (i = e[n]); n++) try {
                t(i).triggerHandler("remove")
            } catch (o) {}
            a(e)
        }, t.widget = function (e, i, n) {
            var a, o, s, r, l = {},
                c = e.split(".")[0];
            e = e.split(".")[1], a = c + "-" + e, n || (n = i, i = t.Widget), t.expr[":"][a.toLowerCase()] = function (e) {
                return !!t.data(e, a)
            }, t[c] = t[c] || {}, o = t[c][e], s = t[c][e] = function (t, e) {
                if (!this._createWidget) return new s(t, e);
                arguments.length && this._createWidget(t, e)
            }, t.extend(s, o, {
                version: n.version,
                _proto: t.extend({}, n),
                _childConstructors: []
            }), (r = new i).options = t.widget.extend({}, r.options), t.each(n, function (e, n) {
                var a, o;
                t.isFunction(n) ? l[e] = (a = function () {
                    return i.prototype[e].apply(this, arguments)
                }, o = function (t) {
                    return i.prototype[e].apply(this, t)
                }, function () {
                    var t, e = this._super,
                        i = this._superApply;
                    return this._super = a, this._superApply = o, t = n.apply(this, arguments), this._super = e, this._superApply = i, t
                }) : l[e] = n
            }), s.prototype = t.widget.extend(r, {
                widgetEventPrefix: o ? r.widgetEventPrefix : e
            }, l, {
                constructor: s,
                namespace: c,
                widgetName: e,
                widgetFullName: a
            }), o ? (t.each(o._childConstructors, function (e, i) {
                var n = i.prototype;
                t.widget(n.namespace + "." + n.widgetName, s, i._proto)
            }), delete o._childConstructors) : i._childConstructors.push(s), t.widget.bridge(e, s)
        }, t.widget.extend = function (i) {
            for (var a, o, s = n.call(arguments, 1), r = 0, l = s.length; r < l; r++)
                for (a in s[r]) o = s[r][a], s[r].hasOwnProperty(a) && o !== e && (t.isPlainObject(o) ? i[a] = t.isPlainObject(i[a]) ? t.widget.extend({}, i[a], o) : t.widget.extend({}, o) : i[a] = o);
            return i
        }, t.widget.bridge = function (i, a) {
            var o = a.prototype.widgetFullName || i;
            t.fn[i] = function (s) {
                var r = "string" == typeof s,
                    l = n.call(arguments, 1),
                    c = this;
                return s = !r && l.length ? t.widget.extend.apply(null, [s].concat(l)) : s, r ? this.each(function () {
                    var n, a = t.data(this, o);
                    return a ? t.isFunction(a[s]) && "_" !== s.charAt(0) ? (n = a[s].apply(a, l)) !== a && n !== e ? (c = n && n.jquery ? c.pushStack(n.get()) : n, !1) : void 0 : t.error("no such method '" + s + "' for " + i + " widget instance") : t.error("cannot call methods on " + i + " prior to initialization; attempted to call method '" + s + "'")
                }) : this.each(function () {
                    var e = t.data(this, o);
                    e ? e.option(s || {})._init() : t.data(this, o, new a(s, this))
                }), c
            }
        }, t.Widget = function () {}, t.Widget._childConstructors = [], t.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            defaultElement: "<div>",
            options: {
                disabled: !1,
                create: null
            },
            _createWidget: function (e, n) {
                n = t(n || this.defaultElement || this)[0], this.element = t(n), this.uuid = i++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = t.widget.extend({}, this.options, this._getCreateOptions(), e), this.bindings = t(), this.hoverable = t(), this.focusable = t(), n !== this && (t.data(n, this.widgetFullName, this), this._on(!0, this.element, {
                    remove: function (t) {
                        t.target === n && this.destroy()
                    }
                }), this.document = t(n.style ? n.ownerDocument : n.document || n), this.window = t(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
            },
            _getCreateOptions: t.noop,
            _getCreateEventData: t.noop,
            _create: t.noop,
            _init: t.noop,
            destroy: function () {
                this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(t.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
            },
            _destroy: t.noop,
            widget: function () {
                return this.element
            },
            option: function (i, n) {
                var a, o, s, r = i;
                if (0 === arguments.length) return t.widget.extend({}, this.options);
                if ("string" == typeof i)
                    if (r = {}, i = (a = i.split(".")).shift(), a.length) {
                        for (o = r[i] = t.widget.extend({}, this.options[i]), s = 0; s < a.length - 1; s++) o[a[s]] = o[a[s]] || {}, o = o[a[s]];
                        if (i = a.pop(), n === e) return o[i] === e ? null : o[i];
                        o[i] = n
                    } else {
                        if (n === e) return this.options[i] === e ? null : this.options[i];
                        r[i] = n
                    }
                return this._setOptions(r), this
            },
            _setOptions: function (t) {
                var e;
                for (e in t) this._setOption(e, t[e]);
                return this
            },
            _setOption: function (t, e) {
                return this.options[t] = e, "disabled" === t && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!e).attr("aria-disabled", e), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this
            },
            enable: function () {
                return this._setOption("disabled", !1)
            },
            disable: function () {
                return this._setOption("disabled", !0)
            },
            _on: function (e, i, n) {
                var a, o = this;
                "boolean" != typeof e && (n = i, i = e, e = !1), n ? (i = a = t(i), this.bindings = this.bindings.add(i)) : (n = i, i = this.element, a = this.widget()), t.each(n, function (n, s) {
                    function r() {
                        if (e || !0 !== o.options.disabled && !t(this).hasClass("ui-state-disabled")) return ("string" == typeof s ? o[s] : s).apply(o, arguments)
                    }
                    "string" != typeof s && (r.guid = s.guid = s.guid || r.guid || t.guid++);
                    var l = n.match(/^(\w+)\s*(.*)$/),
                        c = l[1] + o.eventNamespace,
                        d = l[2];
                    d ? a.delegate(d, c, r) : i.bind(c, r)
                })
            },
            _off: function (t, e) {
                e = (e || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, t.unbind(e).undelegate(e)
            },
            _delay: function (t, e) {
                function i() {
                    return ("string" == typeof t ? n[t] : t).apply(n, arguments)
                }
                var n = this;
                return setTimeout(i, e || 0)
            },
            _hoverable: function (e) {
                this.hoverable = this.hoverable.add(e), this._on(e, {
                    mouseenter: function (e) {
                        t(e.currentTarget).addClass("ui-state-hover")
                    },
                    mouseleave: function (e) {
                        t(e.currentTarget).removeClass("ui-state-hover")
                    }
                })
            },
            _focusable: function (e) {
                this.focusable = this.focusable.add(e), this._on(e, {
                    focusin: function (e) {
                        t(e.currentTarget).addClass("ui-state-focus")
                    },
                    focusout: function (e) {
                        t(e.currentTarget).removeClass("ui-state-focus")
                    }
                })
            },
            _trigger: function (e, i, n) {
                var a, o, s = this.options[e];
                if (n = n || {}, (i = t.Event(i)).type = (e === this.widgetEventPrefix ? e : this.widgetEventPrefix + e).toLowerCase(), i.target = this.element[0], o = i.originalEvent)
                    for (a in o) a in i || (i[a] = o[a]);
                return this.element.trigger(i, n), !(t.isFunction(s) && !1 === s.apply(this.element[0], [i].concat(n)) || i.isDefaultPrevented())
            }
        }, t.each({
            show: "fadeIn",
            hide: "fadeOut"
        }, function (e, i) {
            t.Widget.prototype["_" + e] = function (n, a, o) {
                "string" == typeof a && (a = {
                    effect: a
                });
                var s, r = a ? !0 === a || "number" == typeof a ? i : a.effect || i : e;
                "number" == typeof (a = a || {}) && (a = {
                    duration: a
                }), s = !t.isEmptyObject(a), a.complete = o, a.delay && n.delay(a.delay), s && t.effects && t.effects.effect[r] ? n[e](a) : r !== e && n[r] ? n[r](a.duration, a.easing, o) : n.queue(function (i) {
                    t(this)[e](), o && o.call(n[0]), i()
                })
            }
        })
    }(jQuery),
    function (t) {
        var e = !1;
        t(document).mouseup(function () {
            e = !1
        }), t.widget("ui.mouse", {
            version: "1.10.2",
            options: {
                cancel: "input,textarea,button,select,option",
                distance: 1,
                delay: 0
            },
            _mouseInit: function () {
                var e = this;
                this.element.bind("mousedown." + this.widgetName, function (t) {
                    return e._mouseDown(t)
                }).bind("click." + this.widgetName, function (i) {
                    if (!0 === t.data(i.target, e.widgetName + ".preventClickEvent")) return t.removeData(i.target, e.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1
                }), this.started = !1
            },
            _mouseDestroy: function () {
                this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
            },
            _mouseDown: function (i) {
                if (!e) {
                    this._mouseStarted && this._mouseUp(i), this._mouseDownEvent = i;
                    var n = this,
                        a = 1 === i.which,
                        o = !("string" != typeof this.options.cancel || !i.target.nodeName) && t(i.target).closest(this.options.cancel).length;
                    return !(a && !o && this._mouseCapture(i)) || (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
                        n.mouseDelayMet = !0
                    }, this.options.delay)), this._mouseDistanceMet(i) && this._mouseDelayMet(i) && (this._mouseStarted = !1 !== this._mouseStart(i), !this._mouseStarted) ? (i.preventDefault(), !0) : (!0 === t.data(i.target, this.widgetName + ".preventClickEvent") && t.removeData(i.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (t) {
                        return n._mouseMove(t)
                    }, this._mouseUpDelegate = function (t) {
                        return n._mouseUp(t)
                    }, t(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), i.preventDefault(), e = !0, !0))
                }
            },
            _mouseMove: function (e) {
                return t.ui.ie && (!document.documentMode || document.documentMode < 9) && !e.button ? this._mouseUp(e) : this._mouseStarted ? (this._mouseDrag(e), e.preventDefault()) : (this._mouseDistanceMet(e) && this._mouseDelayMet(e) && (this._mouseStarted = !1 !== this._mouseStart(this._mouseDownEvent, e), this._mouseStarted ? this._mouseDrag(e) : this._mouseUp(e)), !this._mouseStarted)
            },
            _mouseUp: function (e) {
                return t(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, e.target === this._mouseDownEvent.target && t.data(e.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(e)), !1
            },
            _mouseDistanceMet: function (t) {
                return Math.max(Math.abs(this._mouseDownEvent.pageX - t.pageX), Math.abs(this._mouseDownEvent.pageY - t.pageY)) >= this.options.distance
            },
            _mouseDelayMet: function () {
                return this.mouseDelayMet
            },
            _mouseStart: function () {},
            _mouseDrag: function () {},
            _mouseStop: function () {},
            _mouseCapture: function () {
                return !0
            }
        })
    }(jQuery),
    function (t) {
        var e = 5;
        t.widget("ui.slider", t.ui.mouse, {
            version: "1.10.2",
            widgetEventPrefix: "slide",
            options: {
                animate: !1,
                distance: 0,
                max: 100,
                min: 0,
                orientation: "horizontal",
                range: !1,
                step: 1,
                value: 0,
                values: null,
                change: null,
                slide: null,
                start: null,
                stop: null
            },
            _create: function () {
                this._keySliding = !1, this._mouseSliding = !1, this._animateOff = !0, this._handleIndex = null, this._detectOrientation(), this._mouseInit(), this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-corner-all"), this._refresh(), this._setOption("disabled", this.options.disabled), this._animateOff = !1
            },
            _refresh: function () {
                this._createRange(), this._createHandles(), this._setupEvents(), this._refreshValue()
            },
            _createHandles: function () {
                var e, i, n = this.options,
                    a = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
                    o = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
                    s = [];
                for (i = n.values && n.values.length || 1, a.length > i && (a.slice(i).remove(), a = a.slice(0, i)), e = a.length; e < i; e++) s.push(o);
                this.handles = a.add(t(s.join("")).appendTo(this.element)), this.handle = this.handles.eq(0), this.handles.each(function (e) {
                    t(this).data("ui-slider-handle-index", e)
                })
            },
            _createRange: function () {
                var e = this.options,
                    i = "";
                e.range ? (!0 === e.range && (e.values ? e.values.length && 2 !== e.values.length ? e.values = [e.values[0], e.values[0]] : t.isArray(e.values) && (e.values = e.values.slice(0)) : e.values = [this._valueMin(), this._valueMin()]), this.range && this.range.length ? this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({
                    left: "",
                    bottom: ""
                }) : (this.range = t("<div></div>").appendTo(this.element), i = "ui-slider-range ui-widget-header ui-corner-all"), this.range.addClass(i + ("min" === e.range || "max" === e.range ? " ui-slider-range-" + e.range : ""))) : this.range = t([])
            },
            _setupEvents: function () {
                var t = this.handles.add(this.range).filter("a");
                this._off(t), this._on(t, this._handleEvents), this._hoverable(t), this._focusable(t)
            },
            _destroy: function () {
                this.handles.remove(), this.range.remove(), this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"), this._mouseDestroy()
            },
            _mouseCapture: function (e) {
                var i, n, a, o, s, r, l, c = this,
                    d = this.options;
                return !d.disabled && (this.elementSize = {
                    width: this.element.outerWidth(),
                    height: this.element.outerHeight()
                }, this.elementOffset = this.element.offset(), i = {
                    x: e.pageX,
                    y: e.pageY
                }, n = this._normValueFromMouse(i), a = this._valueMax() - this._valueMin() + 1, this.handles.each(function (e) {
                    var i = Math.abs(n - c.values(e));
                    (a > i || a === i && (e === c._lastChangedValue || c.values(e) === d.min)) && (a = i, o = t(this), s = e)
                }), !1 !== this._start(e, s) && (this._mouseSliding = !0, this._handleIndex = s, o.addClass("ui-state-active").focus(), r = o.offset(), l = !t(e.target).parents().addBack().is(".ui-slider-handle"), this._clickOffset = l ? {
                    left: 0,
                    top: 0
                } : {
                    left: e.pageX - r.left - o.width() / 2,
                    top: e.pageY - r.top - o.height() / 2 - (parseInt(o.css("borderTopWidth"), 10) || 0) - (parseInt(o.css("borderBottomWidth"), 10) || 0) + (parseInt(o.css("marginTop"), 10) || 0)
                }, this.handles.hasClass("ui-state-hover") || this._slide(e, s, n), this._animateOff = !0, !0))
            },
            _mouseStart: function () {
                return !0
            },
            _mouseDrag: function (t) {
                var e = {
                        x: t.pageX,
                        y: t.pageY
                    },
                    i = this._normValueFromMouse(e);
                return this._slide(t, this._handleIndex, i), !1
            },
            _mouseStop: function (t) {
                return this.handles.removeClass("ui-state-active"), this._mouseSliding = !1, this._stop(t, this._handleIndex), this._change(t, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = !1, !1
            },
            _detectOrientation: function () {
                this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal"
            },
            _normValueFromMouse: function (t) {
                var e, i, n, a, o;
                return "horizontal" === this.orientation ? (e = this.elementSize.width, i = t.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (e = this.elementSize.height, i = t.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)), (n = i / e) > 1 && (n = 1), n < 0 && (n = 0), "vertical" === this.orientation && (n = 1 - n), a = this._valueMax() - this._valueMin(), o = this._valueMin() + n * a, this._trimAlignValue(o)
            },
            _start: function (t, e) {
                var i = {
                    handle: this.handles[e],
                    value: this.value()
                };
                return this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._trigger("start", t, i)
            },
            _slide: function (t, e, i) {
                var n, a, o;
                this.options.values && this.options.values.length ? (n = this.values(e ? 0 : 1), 2 === this.options.values.length && !0 === this.options.range && (0 === e && i > n || 1 === e && i < n) && (i = n), i !== this.values(e) && ((a = this.values())[e] = i, o = this._trigger("slide", t, {
                    handle: this.handles[e],
                    value: i,
                    values: a
                }), n = this.values(e ? 0 : 1), !1 !== o && this.values(e, i, !0))) : i !== this.value() && !1 !== (o = this._trigger("slide", t, {
                    handle: this.handles[e],
                    value: i
                })) && this.value(i)
            },
            _stop: function (t, e) {
                var i = {
                    handle: this.handles[e],
                    value: this.value()
                };
                this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._trigger("stop", t, i)
            },
            _change: function (t, e) {
                if (!this._keySliding && !this._mouseSliding) {
                    var i = {
                        handle: this.handles[e],
                        value: this.value()
                    };
                    this.options.values && this.options.values.length && (i.value = this.values(e), i.values = this.values()), this._lastChangedValue = e, this._trigger("change", t, i)
                }
            },
            value: function (t) {
                return arguments.length ? (this.options.value = this._trimAlignValue(t), this._refreshValue(), void this._change(null, 0)) : this._value()
            },
            values: function (e, i) {
                var n, a, o;
                if (arguments.length > 1) return this.options.values[e] = this._trimAlignValue(i), this._refreshValue(), void this._change(null, e);
                if (!arguments.length) return this._values();
                if (!t.isArray(arguments[0])) return this.options.values && this.options.values.length ? this._values(e) : this.value();
                for (n = this.options.values, a = arguments[0], o = 0; o < n.length; o += 1) n[o] = this._trimAlignValue(a[o]), this._change(null, o);
                this._refreshValue()
            },
            _setOption: function (e, i) {
                var n, a = 0;
                switch ("range" === e && !0 === this.options.range && ("min" === i ? (this.options.value = this._values(0), this.options.values = null) : "max" === i && (this.options.value = this._values(this.options.values.length - 1), this.options.values = null)), t.isArray(this.options.values) && (a = this.options.values.length), t.Widget.prototype._setOption.apply(this, arguments), e) {
                    case "orientation":
                        this._detectOrientation(), this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation), this._refreshValue();
                        break;
                    case "value":
                        this._animateOff = !0, this._refreshValue(), this._change(null, 0), this._animateOff = !1;
                        break;
                    case "values":
                        for (this._animateOff = !0, this._refreshValue(), n = 0; n < a; n += 1) this._change(null, n);
                        this._animateOff = !1;
                        break;
                    case "min":
                    case "max":
                        this._animateOff = !0, this._refreshValue(), this._animateOff = !1;
                        break;
                    case "range":
                        this._animateOff = !0, this._refresh(), this._animateOff = !1
                }
            },
            _value: function () {
                var t = this.options.value;
                return t = this._trimAlignValue(t)
            },
            _values: function (t) {
                var e, i, n;
                if (arguments.length) return e = this.options.values[t], e = this._trimAlignValue(e);
                if (this.options.values && this.options.values.length) {
                    for (i = this.options.values.slice(), n = 0; n < i.length; n += 1) i[n] = this._trimAlignValue(i[n]);
                    return i
                }
                return []
            },
            _trimAlignValue: function (t) {
                if (t <= this._valueMin()) return this._valueMin();
                if (t >= this._valueMax()) return this._valueMax();
                var e = this.options.step > 0 ? this.options.step : 1,
                    i = (t - this._valueMin()) % e,
                    n = t - i;
                return 2 * Math.abs(i) >= e && (n += i > 0 ? e : -e), parseFloat(n.toFixed(5))
            },
            _valueMin: function () {
                return this.options.min
            },
            _valueMax: function () {
                return this.options.max
            },
            _refreshValue: function () {
                var e, i, n, a, o, s = this.options.range,
                    r = this.options,
                    l = this,
                    c = !this._animateOff && r.animate,
                    d = {};
                this.options.values && this.options.values.length ? this.handles.each(function (n) {
                    i = (l.values(n) - l._valueMin()) / (l._valueMax() - l._valueMin()) * 100, d["horizontal" === l.orientation ? "left" : "bottom"] = i + "%", t(this).stop(1, 1)[c ? "animate" : "css"](d, r.animate), !0 === l.options.range && ("horizontal" === l.orientation ? (0 === n && l.range.stop(1, 1)[c ? "animate" : "css"]({
                        left: i + "%"
                    }, r.animate), 1 === n && l.range[c ? "animate" : "css"]({
                        width: i - e + "%"
                    }, {
                        queue: !1,
                        duration: r.animate
                    })) : (0 === n && l.range.stop(1, 1)[c ? "animate" : "css"]({
                        bottom: i + "%"
                    }, r.animate), 1 === n && l.range[c ? "animate" : "css"]({
                        height: i - e + "%"
                    }, {
                        queue: !1,
                        duration: r.animate
                    }))), e = i
                }) : (n = this.value(), a = this._valueMin(), o = this._valueMax(), i = o !== a ? (n - a) / (o - a) * 100 : 0, d["horizontal" === this.orientation ? "left" : "bottom"] = i + "%", this.handle.stop(1, 1)[c ? "animate" : "css"](d, r.animate), "min" === s && "horizontal" === this.orientation && this.range.stop(1, 1)[c ? "animate" : "css"]({
                    width: i + "%"
                }, r.animate), "max" === s && "horizontal" === this.orientation && this.range[c ? "animate" : "css"]({
                    width: 100 - i + "%"
                }, {
                    queue: !1,
                    duration: r.animate
                }), "min" === s && "vertical" === this.orientation && this.range.stop(1, 1)[c ? "animate" : "css"]({
                    height: i + "%"
                }, r.animate), "max" === s && "vertical" === this.orientation && this.range[c ? "animate" : "css"]({
                    height: 100 - i + "%"
                }, {
                    queue: !1,
                    duration: r.animate
                }))
            },
            _handleEvents: {
                keydown: function (i) {
                    var n, a, o, s = t(i.target).data("ui-slider-handle-index");
                    switch (i.keyCode) {
                        case t.ui.keyCode.HOME:
                        case t.ui.keyCode.END:
                        case t.ui.keyCode.PAGE_UP:
                        case t.ui.keyCode.PAGE_DOWN:
                        case t.ui.keyCode.UP:
                        case t.ui.keyCode.RIGHT:
                        case t.ui.keyCode.DOWN:
                        case t.ui.keyCode.LEFT:
                            if (i.preventDefault(), !this._keySliding && (this._keySliding = !0, t(i.target).addClass("ui-state-active"), !1 === this._start(i, s))) return
                    }
                    switch (o = this.options.step, n = a = this.options.values && this.options.values.length ? this.values(s) : this.value(), i.keyCode) {
                        case t.ui.keyCode.HOME:
                            a = this._valueMin();
                            break;
                        case t.ui.keyCode.END:
                            a = this._valueMax();
                            break;
                        case t.ui.keyCode.PAGE_UP:
                            a = this._trimAlignValue(n + (this._valueMax() - this._valueMin()) / e);
                            break;
                        case t.ui.keyCode.PAGE_DOWN:
                            a = this._trimAlignValue(n - (this._valueMax() - this._valueMin()) / e);
                            break;
                        case t.ui.keyCode.UP:
                        case t.ui.keyCode.RIGHT:
                            if (n === this._valueMax()) return;
                            a = this._trimAlignValue(n + o);
                            break;
                        case t.ui.keyCode.DOWN:
                        case t.ui.keyCode.LEFT:
                            if (n === this._valueMin()) return;
                            a = this._trimAlignValue(n - o)
                    }
                    this._slide(i, s, a)
                },
                click: function (t) {
                    t.preventDefault()
                },
                keyup: function (e) {
                    var i = t(e.target).data("ui-slider-handle-index");
                    this._keySliding && (this._keySliding = !1, this._stop(e, i), this._change(e, i), t(e.target).removeClass("ui-state-active"))
                }
            }
        })
    }(jQuery);
var swfobject = function () {
    function t() {
        if (!F) {
            try {
                var t = D.getElementsByTagName("body")[0].appendChild(m("span"));
                t.parentNode.removeChild(t)
            } catch (n) {
                return
            }
            F = !0;
            for (var e = j.length, i = 0; i < e; i++) j[i]()
        }
    }

    function e(t) {
        F ? t() : j[j.length] = t
    }

    function i(t) {
        if (typeof V.addEventListener != N) V.addEventListener("load", t, !1);
        else if (typeof D.addEventListener != N) D.addEventListener("load", t, !1);
        else if (typeof V.attachEvent != N) v(V, "onload", t);
        else if ("function" == typeof V.onload) {
            var e = V.onload;
            V.onload = function () {
                e(), t()
            }
        } else V.onload = t
    }

    function n() {
        L ? a() : o()
    }

    function a() {
        var t = D.getElementsByTagName("body")[0],
            e = m(x);
        e.setAttribute("type", P);
        var i = t.appendChild(e);
        if (i) {
            var n = 0;
            ! function () {
                if (typeof i.GetVariable != N) {
                    var a = i.GetVariable("$version");
                    a && (a = a.split(" ")[1].split(","), W.pv = [parseInt(a[0], 10), parseInt(a[1], 10), parseInt(a[2], 10)])
                } else if (n < 10) return n++, void setTimeout(arguments.callee, 10);
                t.removeChild(e), i = null, o()
            }()
        } else o()
    }

    function o() {
        var t = G.length;
        if (t > 0)
            for (var e = 0; e < t; e++) {
                var i = G[e].id,
                    n = G[e].callbackFn,
                    a = {
                        success: !1,
                        id: i
                    };
                if (W.pv[0] > 0) {
                    var o = g(i);
                    if (o)
                        if (!y(G[e].swfVersion) || W.wk && W.wk < 312)
                            if (G[e].expressInstall && r()) {
                                var d = {};
                                d.data = G[e].expressInstall, d.width = o.getAttribute("width") || "0", d.height = o.getAttribute("height") || "0", o.getAttribute("class") && (d.styleclass = o.getAttribute("class")), o.getAttribute("align") && (d.align = o.getAttribute("align"));
                                for (var u = {}, h = o.getElementsByTagName("param"), p = h.length, f = 0; f < p; f++) "movie" != h[f].getAttribute("name").toLowerCase() && (u[h[f].getAttribute("name")] = h[f].getAttribute("value"));
                                l(d, u, i, n)
                            } else c(o), n && n(a);
                    else b(i, !0), n && (a.success = !0, a.ref = s(i), n(a))
                } else if (b(i, !0), n) {
                    var m = s(i);
                    m && typeof m.SetVariable != N && (a.success = !0, a.ref = m), n(a)
                }
            }
    }

    function s(t) {
        var e = null,
            i = g(t);
        if (i && "OBJECT" == i.nodeName)
            if (typeof i.SetVariable != N) e = i;
            else {
                var n = i.getElementsByTagName(x)[0];
                n && (e = n)
            }
        return e
    }

    function r() {
        return !B && y("6.0.65") && (W.win || W.mac) && !(W.wk && W.wk < 312)
    }

    function l(t, e, i, n) {
        B = !0, S = n || null, T = {
            success: !1,
            id: i
        };
        var a = g(i);
        if (a) {
            "OBJECT" == a.nodeName ? (C = d(a), _ = null) : (C = a, _ = i), t.id = M, (typeof t.width == N || !/%$/.test(t.width) && parseInt(t.width, 10) < 310) && (t.width = "310"), (typeof t.height == N || !/%$/.test(t.height) && parseInt(t.height, 10) < 137) && (t.height = "137"), D.title = D.title.slice(0, 47) + " - Flash Player Installation";
            var o = W.ie && W.win ? "ActiveX" : "PlugIn",
                s = "MMredirectURL=" + V.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + o + "&MMdoctitle=" + D.title;
            if (typeof e.flashvars != N ? e.flashvars += "&" + s : e.flashvars = s, W.ie && W.win && 4 != a.readyState) {
                var r = m("div");
                i += "SWFObjectNew", r.setAttribute("id", i), a.parentNode.insertBefore(r, a), a.style.display = "none",
                    function () {
                        4 == a.readyState ? a.parentNode.removeChild(a) : setTimeout(arguments.callee, 10)
                    }()
            }
            u(t, e, i)
        }
    }

    function c(t) {
        if (W.ie && W.win && 4 != t.readyState) {
            var e = m("div");
            t.parentNode.insertBefore(e, t), e.parentNode.replaceChild(d(t), e), t.style.display = "none",
                function () {
                    4 == t.readyState ? t.parentNode.removeChild(t) : setTimeout(arguments.callee, 10)
                }()
        } else t.parentNode.replaceChild(d(t), t)
    }

    function d(t) {
        var e = m("div");
        if (W.win && W.ie) e.innerHTML = t.innerHTML;
        else {
            var i = t.getElementsByTagName(x)[0];
            if (i) {
                var n = i.childNodes;
                if (n)
                    for (var a = n.length, o = 0; o < a; o++) 1 == n[o].nodeType && "PARAM" == n[o].nodeName || 8 == n[o].nodeType || e.appendChild(n[o].cloneNode(!0))
            }
        }
        return e
    }

    function u(t, e, i) {
        var n, a = g(i);
        if (W.wk && W.wk < 312) return n;
        if (a)
            if (typeof t.id == N && (t.id = i), W.ie && W.win) {
                var o = "";
                for (var s in t) t[s] != Object.prototype[s] && ("data" == s.toLowerCase() ? e.movie = t[s] : "styleclass" == s.toLowerCase() ? o += ' class="' + t[s] + '"' : "classid" != s.toLowerCase() && (o += " " + s + '="' + t[s] + '"'));
                var r = "";
                for (var l in e) e[l] != Object.prototype[l] && (r += '<param name="' + l + '" value="' + e[l] + '" />');
                a.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + o + ">" + r + "</object>", K[K.length] = t.id, n = g(t.id)
            } else {
                var c = m(x);
                for (var d in c.setAttribute("type", P), t) t[d] != Object.prototype[d] && ("styleclass" == d.toLowerCase() ? c.setAttribute("class", t[d]) : "classid" != d.toLowerCase() && c.setAttribute(d, t[d]));
                for (var u in e) e[u] != Object.prototype[u] && "movie" != u.toLowerCase() && h(c, u, e[u]);
                a.parentNode.replaceChild(c, a), n = c
            }
        return n
    }

    function h(t, e, i) {
        var n = m("param");
        n.setAttribute("name", e), n.setAttribute("value", i), t.appendChild(n)
    }

    function p(t) {
        var e = g(t);
        e && "OBJECT" == e.nodeName && (W.ie && W.win ? (e.style.display = "none", function () {
            4 == e.readyState ? f(t) : setTimeout(arguments.callee, 10)
        }()) : e.parentNode.removeChild(e))
    }

    function f(t) {
        var e = g(t);
        if (e) {
            for (var i in e) "function" == typeof e[i] && (e[i] = null);
            e.parentNode.removeChild(e)
        }
    }

    function g(t) {
        var e = null;
        try {
            e = D.getElementById(t)
        } catch (i) {}
        return e
    }

    function m(t) {
        return D.createElement(t)
    }

    function v(t, e, i) {
        t.attachEvent(e, i), H[H.length] = [t, e, i]
    }

    function y(t) {
        var e = W.pv,
            i = t.split(".");
        return i[0] = parseInt(i[0], 10), i[1] = parseInt(i[1], 10) || 0, i[2] = parseInt(i[2], 10) || 0, e[0] > i[0] || e[0] == i[0] && e[1] > i[1] || e[0] == i[0] && e[1] == i[1] && e[2] >= i[2]
    }

    function w(t, e, i, n) {
        if (!W.ie || !W.mac) {
            var a = D.getElementsByTagName("head")[0];
            if (a) {
                var o = i && "string" == typeof i ? i : "screen";
                if (n && (O = null, E = null), !O || E != o) {
                    var s = m("style");
                    s.setAttribute("type", "text/css"), s.setAttribute("media", o), O = a.appendChild(s), W.ie && W.win && typeof D.styleSheets != N && D.styleSheets.length > 0 && (O = D.styleSheets[D.styleSheets.length - 1]), E = o
                }
                W.ie && W.win ? O && typeof O.addRule == x && O.addRule(t, e) : O && typeof D.createTextNode != N && O.appendChild(D.createTextNode(t + " {" + e + "}"))
            }
        }
    }

    function b(t, e) {
        if (Q) {
            var i = e ? "visible" : "hidden";
            F && g(t) ? g(t).style.visibility = i : w("#" + t, "visibility:" + i)
        }
    }

    function k(t) {
        return null != /[\\\"<>\.;]/.exec(t) && typeof encodeURIComponent != N ? encodeURIComponent(t) : t
    }
    var C, _, S, T, O, E, N = "undefined",
        x = "object",
        A = "Shockwave Flash",
        $ = "ShockwaveFlash.ShockwaveFlash",
        P = "application/x-shockwave-flash",
        M = "SWFObjectExprInst",
        I = "onreadystatechange",
        V = window,
        D = document,
        U = navigator,
        L = !1,
        j = [n],
        G = [],
        K = [],
        H = [],
        F = !1,
        B = !1,
        Q = !0,
        W = function () {
            var t = typeof D.getElementById != N && typeof D.getElementsByTagName != N && typeof D.createElement != N,
                e = U.userAgent.toLowerCase(),
                i = U.platform.toLowerCase(),
                n = i ? /win/.test(i) : /win/.test(e),
                a = i ? /mac/.test(i) : /mac/.test(e),
                o = !!/webkit/.test(e) && parseFloat(e.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")),
                s = !1,
                r = [0, 0, 0],
                l = null;
            if (typeof U.plugins != N && typeof U.plugins[A] == x) !(l = U.plugins[A].description) || typeof U.mimeTypes != N && U.mimeTypes[P] && !U.mimeTypes[P].enabledPlugin || (L = !0, s = !1, l = l.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), r[0] = parseInt(l.replace(/^(.*)\..*$/, "$1"), 10), r[1] = parseInt(l.replace(/^.*\.(.*)\s.*$/, "$1"), 10), r[2] = /[a-zA-Z]/.test(l) ? parseInt(l.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0);
            else if (typeof V.ActiveXObject != N) try {
                var c = new ActiveXObject($);
                c && (l = c.GetVariable("$version")) && (s = !0, l = l.split(" ")[1].split(","), r = [parseInt(l[0], 10), parseInt(l[1], 10), parseInt(l[2], 10)])
            } catch (d) {}
            return {
                w3: t,
                pv: r,
                wk: o,
                ie: s,
                win: n,
                mac: a
            }
        }();
    W.w3 && ((typeof D.readyState != N && "complete" == D.readyState || typeof D.readyState == N && (D.getElementsByTagName("body")[0] || D.body)) && t(), F || (typeof D.addEventListener != N && D.addEventListener("DOMContentLoaded", t, !1), W.ie && W.win && (D.attachEvent(I, function () {
        "complete" == D.readyState && (D.detachEvent(I, arguments.callee), t())
    }), V == top && function () {
        if (!F) {
            try {
                D.documentElement.doScroll("left")
            } catch (e) {
                return void setTimeout(arguments.callee, 0)
            }
            t()
        }
    }()), W.wk && function () {
        F || (/loaded|complete/.test(D.readyState) ? t() : setTimeout(arguments.callee, 0))
    }(), i(t))), W.ie && W.win && window.attachEvent("onunload", function () {
        for (var t = H.length, e = 0; e < t; e++) H[e][0].detachEvent(H[e][1], H[e][2]);
        for (var i = K.length, n = 0; n < i; n++) p(K[n]);
        for (var a in W) W[a] = null;
        for (var o in W = null, swfobject) swfobject[o] = null;
        swfobject = null
    });
    return {
        registerObject: function (t, e, i, n) {
            if (W.w3 && t && e) {
                var a = {};
                a.id = t, a.swfVersion = e, a.expressInstall = i, a.callbackFn = n, G[G.length] = a, b(t, !1)
            } else n && n({
                success: !1,
                id: t
            })
        },
        getObjectById: function (t) {
            if (W.w3) return s(t)
        },
        embedSWF: function (t, i, n, a, o, s, c, d, h, p) {
            var f = {
                success: !1,
                id: i
            };
            W.w3 && !(W.wk && W.wk < 312) && t && i && n && a && o ? (b(i, !1), e(function () {
                n += "", a += "";
                var e = {};
                if (h && typeof h === x)
                    for (var g in h) e[g] = h[g];
                e.data = t, e.width = n, e.height = a;
                var m = {};
                if (d && typeof d === x)
                    for (var v in d) m[v] = d[v];
                if (c && typeof c === x)
                    for (var w in c) typeof m.flashvars != N ? m.flashvars += "&" + w + "=" + c[w] : m.flashvars = w + "=" + c[w];
                if (y(o)) {
                    var k = u(e, m, i);
                    e.id == i && b(i, !0), f.success = !0, f.ref = k
                } else {
                    if (s && r()) return e.data = s, void l(e, m, i, p);
                    b(i, !0)
                }
                p && p(f)
            })) : p && p(f)
        },
        switchOffAutoHideShow: function () {
            Q = !1
        },
        ua: W,
        getFlashPlayerVersion: function () {
            return {
                major: W.pv[0],
                minor: W.pv[1],
                release: W.pv[2]
            }
        },
        hasFlashPlayerVersion: y,
        createSWF: function (t, e, i) {
            return W.w3 ? u(t, e, i) : undefined
        },
        showExpressInstall: function (t, e, i, n) {
            W.w3 && r() && l(t, e, i, n)
        },
        removeSWF: function (t) {
            W.w3 && p(t)
        },
        createCSS: function (t, e, i, n) {
            W.w3 && w(t, e, i, n)
        },
        addDomLoadEvent: e,
        addLoadEvent: i,
        getQueryParamValue: function (t) {
            var e = D.location.search || D.location.hash;
            if (e) {
                if (/\?/.test(e) && (e = e.split("?")[1]), null == t) return k(e);
                for (var i = e.split("&"), n = 0; n < i.length; n++)
                    if (i[n].substring(0, i[n].indexOf("=")) == t) return k(i[n].substring(i[n].indexOf("=") + 1))
            }
            return ""
        },
        expressInstallCallback: function () {
            if (B) {
                var t = g(M);
                t && C && (t.parentNode.replaceChild(C, t), _ && (b(_, !0), W.ie && W.win && (C.style.display = "block")), S && S(T)), B = !1
            }
        }
    }
}();
! function (t) {
    var e, i;
    t.NOMENSA = t.NOMENSA || {}, t.NOMENSA.uaMatch = function (t) {
        t = t.toLowerCase();
        var e = /(webkit)[ \/]([\w.]+)/.exec(t) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(t) || /(msie) ([\w.]+)/.exec(t) || t.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(t) || [];
        return {
            browser: e[1] || "",
            version: e[2] || "0"
        }
    }, i = {}, (e = t.NOMENSA.uaMatch(t.navigator.userAgent)).browser && (i[e.browser] = !0, i.version = e.version), t.NOMENSA.browser = i
}(window), window.NOMENSA = window.NOMENSA || {}, window.NOMENSA.player = window.NOMENSA.player || {},
    window.NOMENSA.player.YoutubePlayer = function (t) {
        this.config = t, this.config.playerVars = {
            controls: 0,
            showinfo: 0,
            origin: window.location.protocol + "//" + window.location.hostname,
            rel: 0
        }
    }, window.NOMENSA.player.YoutubePlayer.apiLoaded = !1, window.NOMENSA.player.YoutubePlayer.prototype = {
        getYTOptions: function () {
            var t = this,
                e = {
                    height: this.config.flashHeight,
                    width: this.config.flashWidth,
                    videoId: this.config.media,
                    events: {
                        onReady: function (e) {
                            t.$html.find("iframe").attr({
                                id: t.config.id,
                                role: "presentation"
                            }), t.onPlayerReady(e)
                        },
                        onStateChange: function (e) {
                            t.onPlayerStateChange(e.data)
                        }
                    }
                };
            return e.playerVars = this.config.playerVars, this.config.repeat && (e.playerVars.playlist = this.config.media), e
        },
        init: "undefined" != typeof window.postMessage ? function (t) {
            var e = document.createElement("script"),
                i = document.getElementsByTagName("script")[0];
            this.$html = this.assembleHTML(), this.config.captions && this.getCaptions(), t.html(this.$html), window.NOMENSA.player.PlayerDaemon.addPlayer(this), window.NOMENSA.player.YoutubePlayer.apiLoaded ? this.player = YT.Player("player-" + player.config.id, getOptions(player)) : "undefined" == typeof window.onYouTubeIframeAPIReady && (window.onYouTubeIframeAPIReady = function () {
                window.NOMENSA.player.PlayerDaemon.map(function (t) {
                    "undefined" != typeof t.getYTOptions && (t.player = new YT.Player("player-" + t.config.id, t.getYTOptions()))
                }), window.NOMENSA.player.YoutubePlayer.apiLoaded = !0
            }, e.src = "//www.youtube.com/iframe_api", i.parentNode.insertBefore(e, i))
        } : function (t) {
            var e = this;
            this.$html = this.assembleHTML(), this.config.captions && this.getCaptions(), t.html(this.$html), window.NOMENSA.player.PlayerDaemon.addPlayer(this), window.NOMENSA.player.stateHandlers[this.config.id] = function (t) {
                window.NOMENSA.player.PlayerDaemon.getPlayer(e.config.id).onPlayerStateChange(t)
            }, window.onYouTubePlayerReady = function (t) {
                var i = window.NOMENSA.player.PlayerDaemon.getPlayer(t),
                    n = document.getElementById(i.config.id);
                i.player = n, i.cue(), i.getPlayer().addEventListener("onStateChange", "window.NOMENSA.player.stateHandlers." + e.config.id), i.onPlayerReady()
            }
        },
        state: {
            ended: 0,
            playing: 1,
            paused: 2,
            unstarted: -1
        },
        onPlayerReady: function () {
            var t, e = [];
            return function (i) {
                var n = e.length;
                if ("function" == typeof i) e.push(i);
                else {
                    if (0 === n) return !1;
                    for (t = 0; t < n; t++) e[t].apply(this, arguments)
                }
            }
        }(),
        onPlayerStateChange: function (t) {
            1 == t ? (this.play(), this.config.buttons.toggle && this.$html.find(".play").removeClass("play").addClass("pause").text("Pause")) : this.config.repeat && 0 == t && this.play()
        },
        getFlashVars: function () {
            var t = {
                controlbar: "none",
                file: this.config.media
            };
            return "" != this.config.image && (t.image = this.config.image), this.config.repeat && (t.repeat = this.config.repeat), t
        },
        getFlashParams: function () {
            return {
                allowScriptAccess: "always",
                wmode: "transparent"
            }
        },
        generateFlashPlayer: function (t) {
            var e = this,
                i = this.getFlashVars(),
                n = this.getFlashParams(),
                a = {
                    id: this.config.id,
                    name: this.config.id
                },
                o = $("<" + this.config.flashContainer + " />").attr("id", "player-" + this.config.id).addClass("flashReplace").html('This content requires Macromedia Flash Player. You can <a href="http://get.adobe.com/flashplayer/">install or upgrade the Adobe Flash Player here</a>.'),
                s = $("<span />").addClass("video"),
                r = this.getURL();
            return setTimeout(function () {
                swfobject.embedSWF(r, o.attr("id"), e.config.flashWidth, e.config.flashHeight, "9.0.115", null, i, n, a, e.config.swfCallback), window.NOMENSA.browser.mozilla && parseInt(window.NOMENSA.browser.version, 10) >= 2 && e.$html.find("object").attr("tabindex", "-1")
            }, 0), t.append(s.append(o)), t
        },
        generateVideoPlayer: function (t) {
            if ("undefined" == typeof window.postMessage) return this.generateFlashPlayer(t);
            var e = $("<" + this.config.flashContainer + " />").attr("id", "player-" + this.config.id),
                i = $("<span />").addClass("video");
            return t.append(i.append(e)), t
        },
        getPlayer: function () {
            return this.player
        },
        is_html5: !1,
        play: function () {
            this.player.playVideo(), this.setSliderTimeout(), this.config.captionsOn && this.captions && this.setCaptionTimeout()
        },
        pause: function () {
            this.player.pauseVideo(), this.clearSliderTimeout(), this.config.captionsOn && this.captions && this.clearCaptionTimeout()
        },
        ffwd: function () {
            var t = this.getCurrentTime() + this.config.playerSkip,
                e = this.getDuration();
            t > e && (t = e), this.seek(t)
        },
        rewd: function () {
            var t = this.getCurrentTime() - this.config.playerSkip;
            t < 0 && (t = 0), this.seek(t)
        },
        mute: function () {
            var t = this.$html.find("button.mute");
            this.player.isMuted() ? (this.player.unMute(), t.hasClass("muted") && t.removeClass("muted")) : (this.player.mute(), t.addClass("muted"))
        },
        volup: function () {
            var t = this.player.getVolume();
            t >= 100 ? t = 100 : t += this.config.volumeStep, this.player.setVolume(t), this.updateVolume(t)
        },
        voldwn: function () {
            var t = this.player.getVolume();
            t <= 0 ? t = 0 : t -= this.config.volumeStep, this.player.setVolume(t), this.updateVolume(t)
        },
        getDuration: function () {
            return this.player.getDuration()
        },
        getCurrentTime: function () {
            return this.player.getCurrentTime()
        },
        getBytesLoaded: function () {
            return this.player.getVideoBytesLoaded()
        },
        getBytesTotal: function () {
            return this.player.getVideoBytesTotal()
        },
        seek: function (t) {
            this.player.seekTo(t, !0), this.config.captionsOn && this.captions && (this.$html.find(".caption").remove(), this.clearCaptionTimeout(), this.setCaptionTimeout(), this.getPreviousCaption())
        },
        cue: function () {
            this.player.cueVideoById(this.config.media)
        },
        toggleCaptions: function () {
            var t = this,
                e = this.$html.find(".captions");
            e.hasClass("captions-off") ? (e.removeClass("captions-off").addClass("captions-on"), t.getPreviousCaption(), t.setCaptionTimeout(), t.config.captionsOn = !0) : (e.removeClass("captions-on").addClass("captions-off"), t.clearCaptionTimeout(), t.$html.find(".caption").remove(), t.config.captionsOn = !1)
        }
    }, window.NOMENSA = window.NOMENSA || {}, window.NOMENSA.player = window.NOMENSA.player || {}, window.NOMENSA.player.MediaplayerDecorator = function (t) {
        var e = t;
        for (var i in this.config = e.config, this.player = e.player, this.state = e.state, e) "function" == typeof e[i] && (this[i] = function (t) {
            return function () {
                return e[t].apply(this, arguments)
            }
        }(i))
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.generatePlayerContainer = function () {
        var t = $("<" + this.config.playerContainer + " />").css(this.config.playerStyles).addClass("player-container");
        return window.NOMENSA.browser.msie && t.addClass("player-container-ie player-container-ie-" + window.NOMENSA.browser.version.substring(0, 1)), t
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.assembleHTML = function () {
        var t = this.generatePlayerContainer();
        return this.generateVideoPlayer(t).append(this.getControls())
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.getURL = function () {
        return [this.config.url, this.config.id].join("")
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.createButton = function (t, e) {
        var i = [t, this.config.id].join("-");
        return $("<button />").append(e).addClass(t).attr({
            title: t,
            id: i
        }).addClass("ui-corner-all ui-state-default").hover(function () {
            $(this).addClass("ui-state-hover")
        }, function () {
            $(this).removeClass("ui-state-hover")
        }).focus(function () {
            $(this).addClass("ui-state-focus")
        }).blur(function () {
            $(this).removeClass("ui-state-focus")
        }).click(function (t) {
            t.preventDefault()
        })
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.getFuncControls = function () {
        var t = this,
            e = $("<div>");
        e[0].className = "player-controls";
        var i = [];
        if (t.config.buttons.toggle) {
            var n = t.createButton("play", "Play").attr({
                "aria-live": "assertive"
            }).click(function () {
                $(this).hasClass("play") ? ($(this).removeClass("play").addClass("pause").attr({
                    title: "Pause",
                    id: "pause-" + t.config.id
                }).text("Pause"), t.play()) : ($(this).removeClass("pause").addClass("play").attr({
                    title: "Play",
                    id: "play-" + t.config.id
                }).text("Play"), t.pause())
            });
            i.push(n)
        } else {
            var a = t.createButton("play", "Play").click(function () {
                    t.play()
                }),
                o = t.createButton("pause", "Pause").click(function () {
                    t.pause()
                });
            i.push(a), i.push(o)
        }
        if (t.config.buttons.rewind) {
            var s = t.createButton("rewind", "Rewind").click(function () {
                t.rewd()
            });
            i.push(s)
        }
        if (t.config.buttons.forward) {
            var r = t.createButton("forward", "Forward").click(function () {
                t.ffwd()
            });
            i.push(r)
        }
        if (t.config.captions) {
            var l = t.createButton("captions", "Captions").click(function () {
                    t.toggleCaptions()
                }),
                c = 1 == t.config.captionsOn ? "captions-on" : "captions-off";
            l.addClass(c), i.push(l)
        }
        for (var d = 0; d < i.length; d += 1) e[0].appendChild(i[d][0]);
        return e
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.getVolControls = function () {
        for (var t = this, e = $("<div>").addClass("volume-controls"), i = t.createButton("mute", "Mute").click(function () {
                t.mute()
            }), n = t.createButton("vol-up", '+<span class="ui-helper-hidden-accessible"> Volume Up</span>').click(function () {
                t.volup()
            }), a = [i, t.createButton("vol-down", '-<span class="ui-helper-hidden-accessible"> Volume Down</span>').click(function () {
                t.voldwn()
            }), n, $("<span />").attr({
                id: "vol-" + t.config.id,
                "class": "vol-display"
            }).text("100%")], o = 0; o < a.length; o += 1) e[0].appendChild(a[o][0]);
        return e
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.getSliderBar = function () {
        for (var t = $("<span />").addClass("ui-helper-hidden-accessible").html("<p>The timeline slider below uses WAI ARIA. Please use the documentation for your screen reader to find out more.</p>"), e = $("<span />").addClass("current-time").attr({
                id: "current-" + this.config.id
            }).text("00:00:00"), i = this.getSlider(), n = $("<span />").addClass("duration-time").attr({
                id: "duration-" + this.config.id
            }).text("00:00:00"), a = $("<div />").addClass("timer-bar").append(t), o = [e, i, n], s = 0; s < o.length; s += 1) a[0].appendChild(o[s][0]);
        return a
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.getSlider = function () {
        var t = this,
            e = $("<span />").attr("id", "slider-" + this.config.id).slider({
                orientation: "horizontal",
                change: function (e, i) {
                    var n = i.value / 100 * t.getDuration();
                    t.seek(n)
                }
            });
        e.find("a.ui-slider-handle").attr({
            role: "slider",
            "aria-valuemin": "0",
            "aria-valuemax": "100",
            "aria-valuenow": "0",
            "aria-valuetext": "0 percent",
            title: "Slider Control"
        });
        var i = $("<span />").addClass("progress-bar").attr({
                id: "progress-bar-" + this.config.id,
                tabindex: "-1"
            }).addClass("ui-progressbar-value ui-widget-header ui-corner-left").css({
                width: "0%",
                height: "95%"
            }),
            n = $("<span />").attr({
                id: "loaded-bar-" + this.config.id,
                tabindex: "-1"
            }).addClass("loaded-bar ui-progressbar-value ui-widget-header ui-corner-left").css({
                height: "95%",
                width: "0%"
            });
        return e.append(i, n)
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.setSliderTimeout = function () {
        var t = this;
        t.sliderInterval == undefined && (t.sliderInterval = setInterval(function () {
            t.updateSlider()
        }, t.config.sliderTimeout))
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.clearSliderTimeout = function () {
        var t = this;
        t.sliderInterval != undefined && (t.sliderInterval = clearInterval(t.sliderInterval))
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.updateSlider = function () {
        var t = "undefined" != typeof this.duration ? this.duration : this.getDuration(),
            e = "boolean" == typeof this.duration_found && this.duration_found,
            i = this.getCurrentTime(),
            n = 0;
        t > 0 ? (n = i / t * 100, n = parseInt(n, 10)) : t = 0, e || ($("#duration-" + this.config.id).html(this.formatTime(parseInt(t, 10))), this.duration_found = !0), $("#slider-" + this.config.id).find("a.ui-slider-handle").attr({
            "aria-valuenow": n,
            "aria-valuetext": n.toString() + " percent"
        }).css("left", n.toString() + "%"), $("#progress-bar-" + this.config.id).attr({
            "aria-valuenow": n,
            "aria-valuetext": n.toString() + " percent"
        }).css("width", n.toString() + "%"), this.updateLoaderBar(), this.updateTime(i)
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.updateLoaderBar = function () {
        var t = this.getBytesLoaded() / this.getBytesTotal() * 100;
        t = parseInt(t, 10), isFinite(t) || (t = 0), $("#loaded-bar-" + this.config.id).attr({
            "aria-valuetext": t.toString() + " percent",
            "aria-valuenow": t
        }).css("width", t.toString() + "%")
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.formatTime = function (t) {
        var e = 0,
            i = 0,
            n = 0;
        t >= 60 ? (n = t - 60 * (i = parseInt(t / 60, 10)), i >= 60 && (e = parseInt(i / 60, 10), i -= parseInt(60 * e, 10))) : n = t;
        for (var a = [e, i, n], o = 0; o < a.length; o += 1) a[o] = a[o] < 10 ? "0" + a[o].toString() : a[o].toString();
        return a.join(":")
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.updateTime = function (t) {
        var e = this.formatTime(parseInt(t, 10));
        this.$html.find("#current-" + this.config.id).html(e)
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.getControls = function () {
        var t = $("<span />").addClass("ui-corner-bottom").addClass("control-bar"),
            e = $("<a />").attr("href", "http://www.nomensa.com?ref=logo").html("Accessible Media Player by Nomensa").addClass("logo");
        t.append(e);
        for (var i = [this.getFuncControls(), this.getVolControls(), this.getSliderBar()], n = 0; n < i.length; n += 1) t[0].appendChild(i[n][0]);
        return t
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.updateVolume = function (t) {
        $("#vol-" + this.config.id).text(t.toString() + "%");
        var e = this.$html.find("button.mute");
        0 == t ? e.addClass("muted") : e.hasClass("muted") && e.removeClass("muted")
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.getCaptions = function () {
        var t = this;
        if (t.config.captions) {
            $.ajax({
                url: t.config.captions,
                success: function (e) {
                    $(e).find("p").length > 0 && (t.captions = $(e).find("p"))
                }
            })
        }
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.toggleCaptions = function () {
        var t = this,
            e = this.$html.find(".captions");
        e.hasClass("captions-off") ? (e.removeClass("captions-off").addClass("captions-on"), t.getPreviousCaption(), t.setCaptionTimeout(), t.config.captionsOn = !0) : (e.removeClass("captions-on").addClass("captions-off"), t.clearCaptionTimeout(), t.$html.find(".caption").remove(), t.config.captionsOn = !1)
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.syncCaptions = function () {
        var t;
        if (this.captions) {
            var e = this.getCurrentTime();
            e = this.formatTime(parseInt(e, 10)), 1 == (t = this.captions.filter('[begin="' + e + '"]')).length && this.insertCaption(t)
        }
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.insertCaption = function (t) {
        if (1 == this.$html.find(".caption").length) this.$html.find(".caption").text(t.text());
        else {
            var e = $("<div>").text(t.text());
            e[0].className = "caption", this.$html.find(".video").prepend(e)
        }
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.getPreviousCaption = function (t) {
        var e;
        t == undefined && (t = this.getCurrentTime());
        var i = this.formatTime(parseInt(t, 10));
        if (this.captions) {
            for (e = this.captions.filter('[begin="' + i + '"]'); 1 != e.length && t > 0;) t--, i = this.formatTime(parseInt(t, 10)), e = this.captions.filter('[begin="' + i + '"]');
            1 == e.length && this.insertCaption(e)
        }
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.destroyPlayerInstance = function () {
        return !1
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.destroy = function () {
        this.clearSliderTimeout(), this.clearCaptionTimeout(), this.destroyPlayerInstance(), this.$html.remove()
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.setCaptionTimeout = function () {
        var t = this;
        t.captionInterval == undefined && (t.captionInterval = setInterval(function () {
            t.syncCaptions()
        }, 500))
    }, window.NOMENSA.player.MediaplayerDecorator.prototype.clearCaptionTimeout = function () {
        this.captionInterval != undefined && (this.captionInterval = clearInterval(this.captionInterval))
    }, window.NOMENSA = window.NOMENSA || {}, window.NOMENSA.player = window.NOMENSA.player || {}, jQuery(function (t) {
        t(window).resize(function () {
            t(".player-container").each(function () {
                t(this).width() > 580 ? t(this).addClass("player-wide") : t(this).removeClass("player-wide")
            })
        })
    }), "undefined" == typeof window.postMessage && (window.NOMENSA.player.stateHandlers = {}), window.NOMENSA.player.PlayerManager = function () {
        var t = {};
        this.getPlayer = function (e) {
            return t[e] != undefined ? t[e] : null
        }, this.addPlayer = function (e) {
            return t[e.config.id] = e, !0
        }, this.removePlayer = function (e) {
            t[e] != undefined && (t[e].destroy(), delete t[e])
        }, this.map = function (e) {
            var i;
            for (i in t) e(t[i])
        }
    }, window.NOMENSA.player.PlayerDaemon = new window.NOMENSA.player.PlayerManager;
var html5_methods = {
    play: function () {
        this.player.play(), this.setSliderTimeout(), this.config.captionsOn && this.captions && this.setCaptionTimeout()
    },
    pause: function () {
        this.player.pause(), this.clearSliderTimeout(), this.config.captionsOn && this.captions && this.clearCaptionTimeout()
    },
    ffwd: function () {
        var t = this.getCurrentTime() + this.config.playerSkip;
        this.seek(t)
    },
    rewd: function () {
        var t = this.getCurrentTime() - this.config.playerSkip;
        t < 0 && (t = 0), this.seek(t)
    },
    mute: function () {
        var t = this.$html.find("button.mute");
        this.player.muted ? (this.player.muted = !1, t.hasClass("muted") && t.removeClass("muted")) : (this.player.muted = !0, t.addClass("muted"))
    },
    volup: function () {
        var t = 100 * this.player.volume;
        t < 100 - this.config.volumeStep ? t += this.config.volumeStep : t = 100, this.player.volume = t / 100, this.updateVolume(Math.round(t))
    },
    voldwn: function () {
        var t = 100 * this.player.volume;
        t > this.config.volumeStep ? t -= this.config.volumeStep : t = 0, this.player.volume = t / 100, this.updateVolume(Math.round(t))
    },
    getDuration: function () {
        return this.player.duration
    },
    getCurrentTime: function () {
        return this.player.currentTime
    },
    getBytesLoaded: function () {
        return this.player.buffered.end(0)
    },
    getBytesTotal: function () {
        return this.player.duration
    },
    seek: function (t) {
        this.player.currentTime = t
    },
    cue: function () {}
};
! function (t) {
    t.fn.player = function (e, i) {
        function n() {
            this.config = o, t.extend(!0, this, d, i), this.is_html5 = !1;
            var e = s(this);
            e && this.config.useHtml5 ? (this.config.media = e.src, this.is_html5 = !0, this.$html = this.assembleHTML5(e.container, e.mimetype), t.extend(this, html5_methods)) : (this.config.media instanceof Array && "undefined" != typeof this.config.media.push && (this.config.media = this.config.media[0]), this.$html = this.assembleHTML()), this.config.captions && this.getCaptions()
        }
        var a = {
                id: "media_player",
                url: window.location.protocol + "//www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid=",
                media: "8LiQ-bLJaM4",
                repeat: !1,
                captions: null,
                captionsOn: !0,
                flashWidth: "100%",
                flashHeight: "300px",
                playerStyles: {
                    height: "100%",
                    width: "100%"
                },
                sliderTimeout: 350,
                flashContainer: "span",
                playerContainer: "span",
                image: "",
                playerSkip: 10,
                volumeStep: 10,
                buttons: {
                    forward: !0,
                    rewind: !0,
                    toggle: !0
                },
                logoURL: "http://www.nomensa.com?ref=logo",
                useHtml5: !0,
                swfCallback: null
            },
            o = t.extend(!0, {}, a, e),
            s = function (t) {
                var e, i, n, a, o, s, r = t.config.media;
                if (a = function (t) {
                        if ((e = document.createElement(t.container)).canPlayType != undefined && ("maybe" == (n = e.canPlayType(t.mimetype)).toLowerCase() || "probably" == n.toLowerCase())) return !0
                    }, "string" == typeof r && a(i = l(r))) return i.src = r, i;
                if (r instanceof Array && "undefined" != typeof r.push)
                    for (o = 0, s = r.length; o < s; o++)
                        if (a(i = l(r[o]))) return i.src = r[o], i;
                return !1
            },
            r = function (t) {
                var e = "",
                    i = "video";
                switch (t) {
                    case "mp4":
                    case "m4v":
                        e = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
                        break;
                    case "ogg":
                    case "ogv":
                        e = 'video/ogg; codecs="theora, vorbis"';
                        break;
                    case "webm":
                        e = 'video/webm; codecs="vp8, vorbis"';
                        break;
                    case "mp3":
                        e = "audio/mpeg", i = "audio"
                }
                return {
                    mimetype: e,
                    container: i
                }
            },
            l = function (t) {
                var e = t.lastIndexOf(".");
                if (-1 != e) {
                    var i = t.substring(e + 1);
                    return r(i)
                }
                return null
            },
            c = function () {
                return !!window.NOMENSA.browser.mozilla && parseInt(window.NOMENSA.browser.version, 10) >= 2
            },
            d = {
                generatePlayerContainer: function () {
                    var e = t("<" + this.config.playerContainer + " />").css(this.config.playerStyles).addClass("player-container");
                    return window.NOMENSA.browser.msie && e.addClass("player-container-ie player-container-ie-" + window.NOMENSA.browser.version.substring(0, 1)), e
                },
                getFlashVars: function () {
                    var t = {
                        controlbar: "none",
                        file: this.config.media
                    };
                    return "" != this.config.image && (t.image = this.config.image), this.config.repeat && (t.repeat = this.config.repeat), t
                },
                getFlashParams: function () {
                    return {
                        allowScriptAccess: "always",
                        wmode: "transparent"
                    }
                },
                getURL: function () {
                    return [this.config.url, this.config.id].join("")
                },
                generateFlashPlayer: function (e) {
                    var i = this,
                        n = this.getFlashVars(),
                        a = this.getFlashParams(),
                        o = {
                            id: this.config.id,
                            name: this.config.id
                        },
                        s = t("<" + this.config.flashContainer + " />").attr("id", "player-" + this.config.id).addClass("flashReplace").html('This content requires Macromedia Flash Player. You can <a href="http://get.adobe.com/flashplayer/">install or upgrade the Adobe Flash Player here</a>.'),
                        r = t("<span />").addClass("video"),
                        l = this.getURL();
                    return setTimeout(function () {
                        swfobject.embedSWF(l, s.attr("id"), i.config.flashWidth, i.config.flashHeight, "9.0.115", null, n, a, o, i.config.swfCallback), c() && i.$html.find("object").attr("tabindex", "-1")
                    }, 0), e.append(r.append(s)), e
                },
                generateHTML5Player: function (e, i, n) {
                    var a = t("<span />");
                    a[0].className = "video";
                    var o = t("<" + i + " />").attr({
                        id: this.config.id,
                        src: this.config.media,
                        type: n
                    }).css({
                        width: "100%",
                        height: "50%"
                    });
                    return "" != t.trim(this.config.image) && o.attr({
                        poster: t.trim(this.config.image)
                    }), e.append(a.append(o))
                },
                createButton: function (e, i) {
                    var n = [e, this.config.id].join("-");
                    return t("<button />").append(i).addClass(e).attr({
                        title: e,
                        id: n
                    }).addClass("ui-corner-all ui-state-default").hover(function () {
                        t(this).addClass("ui-state-hover")
                    }, function () {
                        t(this).removeClass("ui-state-hover")
                    }).focus(function () {
                        t(this).addClass("ui-state-focus")
                    }).blur(function () {
                        t(this).removeClass("ui-state-focus")
                    }).click(function (t) {
                        t.preventDefault()
                    })
                },
                getFuncControls: function () {
                    var e = this,
                        i = t("<div>");
                    i[0].className = "player-controls";
                    var n, a = [];
                    if (e.config.buttons.toggle) {
                        var o = e.createButton("play", "Play").attr({
                            "aria-live": "assertive"
                        }).click(function () {
                            t(this).hasClass("play") ? (t(this).removeClass("play").addClass("pause").attr({
                                title: "Pause",
                                id: "pause-" + e.config.id
                            }).text("Pause"), e.play()) : (t(this).removeClass("pause").addClass("play").attr({
                                title: "Play",
                                id: "play-" + e.config.id
                            }).text("Play"), e.pause())
                        });
                        a.push(o)
                    } else {
                        var s = e.createButton("play", "Play").click(function () {
                                e.play()
                            }),
                            r = e.createButton("pause", "Pause").click(function () {
                                e.pause()
                            });
                        a.push(s), a.push(r)
                    }
                    if (e.config.buttons.rewind) {
                        var l = e.createButton("rewind", "Rewind").click(function () {
                            e.rewd()
                        });
                        a.push(l)
                    }
                    if (e.config.buttons.forward) {
                        var c = e.createButton("forward", "Forward").click(function () {
                            e.ffwd()
                        });
                        a.push(c)
                    }
                    if (e.config.captions) {
                        var d = e.createButton("captions", "Captions").click(function () {
                                e.toggleCaptions()
                            }),
                            u = 1 == e.config.captionsOn ? "captions-on" : "captions-off";
                        d.addClass(u), a.push(d)
                    }
                    for (n = 0; n < a.length; n += 1) i[0].appendChild(a[n][0]);
                    return i
                },
                getVolControls: function () {
                    var e, i = this,
                        n = t("<div>").addClass("volume-controls"),
                        a = i.createButton("mute", "Mute").click(function () {
                            i.mute()
                        }),
                        o = i.createButton("vol-up", '+<span class="ui-helper-hidden-accessible"> Volume Up</span>').click(function () {
                            i.volup()
                        }),
                        s = [a, i.createButton("vol-down", '-<span class="ui-helper-hidden-accessible"> Volume Down</span>').click(function () {
                            i.voldwn()
                        }), o, t("<span />").attr({
                            id: "vol-" + i.config.id,
                            "class": "vol-display"
                        }).text("100%")];
                    for (e = 0; e < s.length; e += 1) n[0].appendChild(s[e][0]);
                    return n
                },
                getSliderBar: function () {
                    var e, i = t("<span />").addClass("ui-helper-hidden-accessible").html("<p>The timeline slider below uses WAI ARIA. Please use the documentation for your screen reader to find out more.</p>"),
                        n = t("<span />").addClass("current-time").attr({
                            id: "current-" + this.config.id
                        }).text("00:00:00"),
                        a = this.getSlider(),
                        o = t("<span />").addClass("duration-time").attr({
                            id: "duration-" + this.config.id
                        }).text("00:00:00"),
                        s = t("<div />").addClass("timer-bar").append(i),
                        r = [n, a, o];
                    for (e = 0; e < r.length; e += 1) s[0].appendChild(r[e][0]);
                    return s
                },
                getSlider: function () {
                    var e = this,
                        i = t("<span />").attr("id", "slider-" + this.config.id).slider({
                            orientation: "horizontal",
                            change: function (t, i) {
                                var n = i.value / 100 * e.getDuration();
                                e.seek(n)
                            }
                        });
                    i.find("a.ui-slider-handle").attr({
                        role: "slider",
                        "aria-valuemin": "0",
                        "aria-valuemax": "100",
                        "aria-valuenow": "0",
                        "aria-valuetext": "0 percent",
                        title: "Slider Control"
                    });
                    var n = t("<span />").addClass("progress-bar").attr({
                            id: "progress-bar-" + this.config.id,
                            tabindex: "-1"
                        }).addClass("ui-progressbar-value ui-widget-header ui-corner-left").css({
                            width: "0%",
                            height: "95%"
                        }),
                        a = t("<span />").attr({
                            id: "loaded-bar-" + this.config.id,
                            tabindex: "-1"
                        }).addClass("loaded-bar ui-progressbar-value ui-widget-header ui-corner-left").css({
                            height: "95%",
                            width: "0%"
                        });
                    return i.append(n, a)
                },
                setSliderTimeout: function () {
                    var t = this;
                    t.sliderInterval == undefined && (t.sliderInterval = setInterval(function () {
                        t.updateSlider()
                    }, t.config.sliderTimeout))
                },
                clearSliderTimeout: function () {
                    var t = this;
                    t.sliderInterval != undefined && (t.sliderInterval = clearInterval(t.sliderInterval))
                },
                updateSlider: function () {
                    var e = "undefined" != typeof this.duration ? this.duration : this.getDuration(),
                        i = "boolean" == typeof this.duration_found && this.duration_found,
                        n = this.getCurrentTime(),
                        a = 0;
                    e > 0 ? (a = n / e * 100, a = parseInt(a, 10)) : e = 0, i || (t("#duration-" + this.config.id).html(this.formatTime(parseInt(e, 10))), this.duration_found = !0), t("#slider-" + this.config.id).find("a.ui-slider-handle").attr({
                        "aria-valuenow": a,
                        "aria-valuetext": a.toString() + " percent"
                    }).css("left", a.toString() + "%"), t("#progress-bar-" + this.config.id).attr({
                        "aria-valuenow": a,
                        "aria-valuetext": a.toString() + " percent"
                    }).css("width", a.toString() + "%"), this.updateLoaderBar(), this.updateTime(n)
                },
                updateLoaderBar: function () {
                    var e = this.getBytesLoaded() / this.getBytesTotal() * 100;
                    e = parseInt(e, 10), isFinite(e) || (e = 0), t("#loaded-bar-" + this.config.id).attr({
                        "aria-valuetext": e.toString() + " percent",
                        "aria-valuenow": e
                    }).css("width", e.toString() + "%")
                },
                formatTime: function (t) {
                    var e = 0,
                        i = 0,
                        n = 0;
                    t >= 60 ? (n = t - 60 * (i = parseInt(t / 60, 10)), i >= 60 && (e = parseInt(i / 60, 10), i -= parseInt(60 * e, 10))) : n = t;
                    var a, o = [e, i, n];
                    for (a = 0; a < o.length; a += 1) o[a] = o[a] < 10 ? "0" + o[a].toString() : o[a].toString();
                    return o.join(":")
                },
                updateTime: function (t) {
                    var e = this.formatTime(parseInt(t, 10));
                    this.$html.find("#current-" + this.config.id).html(e)
                },
                getControls: function () {
                    var e = t("<span />").addClass("ui-corner-bottom").addClass("control-bar"),
                        i = t("<a />").attr("href", "http://www.nomensa.com?ref=logo").html("Accessible Media Player by Nomensa").addClass("logo");
                    e.append(i);
                    var n, a = [this.getFuncControls(), this.getVolControls(), this.getSliderBar()];
                    for (n = 0; n < a.length; n += 1) e[0].appendChild(a[n][0]);
                    return e
                },
                assembleHTML: function () {
                    var t = this.generatePlayerContainer();
                    return this.generateFlashPlayer(t).append(this.getControls())
                },
                assembleHTML5: function (t, e) {
                    var i = this.generatePlayerContainer();
                    return this.generateHTML5Player(i, t, e).append(this.getControls())
                },
                updateVolume: function (e) {
                    t("#vol-" + this.config.id).text(e.toString() + "%");
                    var i = this.$html.find("button.mute");
                    0 == e ? i.addClass("muted") : i.hasClass("muted") && i.removeClass("muted")
                },
                getCaptions: function () {
                    var e = this;
                    if (e.config.captions) {
                        t.ajax({
                            url: e.config.captions,
                            success: function (i) {
                                t(i).find("p").length > 0 && (e.captions = t(i).find("p"))
                            }
                        })
                    }
                },
                syncCaptions: function () {
                    var t;
                    if (this.captions) {
                        var e = this.getCurrentTime();
                        e = this.formatTime(parseInt(e, 10)), 1 == (t = this.captions.filter('[begin="' + e + '"]')).length && this.insertCaption(t)
                    }
                },
                insertCaption: function (e) {
                    if (1 == this.$html.find(".caption").length) this.$html.find(".caption").text(e.text());
                    else {
                        var i = t("<div>").text(e.text());
                        i[0].className = "caption", this.$html.find(".video").prepend(i)
                    }
                },
                getPreviousCaption: function (t) {
                    var e;
                    t == undefined && (t = this.getCurrentTime());
                    var i = this.formatTime(parseInt(t, 10));
                    if (this.captions) {
                        for (e = this.captions.filter('[begin="' + i + '"]'); 1 != e.length && t > 0;) t--, i = this.formatTime(parseInt(t, 10)), e = this.captions.filter('[begin="' + i + '"]');
                        1 == e.length && this.insertCaption(e)
                    }
                },
                destroyPlayerInstance: function () {
                    return !1
                },
                destroy: function () {
                    this.clearSliderTimeout(), this.clearCaptionTimeout(), this.destroyPlayerInstance(), this.$html.remove()
                },
                setCaptionTimeout: function () {
                    var t = this;
                    t.captionInterval == undefined && (t.captionInterval = setInterval(function () {
                        t.syncCaptions()
                    }, 500))
                },
                clearCaptionTimeout: function () {
                    this.captionInterval != undefined && (this.captionInterval = clearInterval(this.captionInterval))
                },
                play: function () {
                    this.player.playVideo(), this.setSliderTimeout(), this.config.captionsOn && this.captions && this.setCaptionTimeout()
                },
                pause: function () {
                    this.player.pauseVideo(), this.clearSliderTimeout(), this.config.captionsOn && this.captions && this.clearCaptionTimeout()
                },
                ffwd: function () {
                    var t = this.getCurrentTime() + this.config.playerSkip;
                    this.seek(t)
                },
                rewd: function () {
                    var t = this.getCurrentTime() - this.config.playerSkip;
                    t < 0 && (t = 0), this.seek(t)
                },
                mute: function () {
                    var t = this.$html.find("button.mute");
                    this.player.isMuted() ? (this.player.unMute(), t.hasClass("muted") && t.removeClass("muted")) : (this.player.mute(), t.addClass("muted"))
                },
                volup: function () {
                    var t = this.player.getVolume();
                    t < 100 - this.config.volumeStep ? t += this.config.volumeStep : t = 100, this.player.setVolume(t), this.updateVolume(t)
                },
                voldwn: function () {
                    var t = this.player.getVolume();
                    t > this.config.volumeStep ? t -= this.config.volumeStep : t = 0, this.player.setVolume(t), this.updateVolume(t)
                },
                getDuration: function () {
                    return this.player.getDuration()
                },
                getCurrentTime: function () {
                    return this.player.getCurrentTime()
                },
                getBytesLoaded: function () {
                    return this.player.getVideoBytesLoaded()
                },
                getBytesTotal: function () {
                    return this.player.getVideoBytesTotal()
                },
                seek: function (t) {
                    this.player.seekTo(t), this.config.captionsOn && this.captions && (this.$html.find(".caption").remove(), this.clearCaptionTimeout(), this.setCaptionTimeout(), this.getPreviousCaption())
                },
                cue: function () {
                    this.player.cueVideoById(this.config.media)
                },
                toggleCaptions: function () {
                    var t = this,
                        e = this.$html.find(".captions");
                    e.hasClass("captions-off") ? (e.removeClass("captions-off").addClass("captions-on"), t.getPreviousCaption(), t.setCaptionTimeout(), t.config.captionsOn = !0) : (e.removeClass("captions-on").addClass("captions-off"), t.clearCaptionTimeout(), t.$html.find(".caption").remove(), t.config.captionsOn = !1)
                }
            };
        return this.each(function (e) {
            var i, a, s = t(this),
                r = function (t) {
                    t.$html.width() > 580 && t.$html.addClass("player-wide"), t.is_html5 && (t.player = document.getElementById(t.config.id))
                };
            o.url.match(/^(http|https)\:\/\/www\.youtube\.com/) ? (i = new window.NOMENSA.player.YoutubePlayer(o), (a = new window.NOMENSA.player.MediaplayerDecorator(i)).onPlayerReady(function () {
                r(a), this.getPlayer().setLoop(!0)
            }), a.init(s)) : (a = new n(e), s.html(a.$html), r(a), window.NOMENSA.player.PlayerDaemon.addPlayer(a))
        })
    }
}(jQuery),
function (t) {
    "use strict";

    function e() {
        function e() {
            var t = document.location.protocol;
            return "file:" == t && (t = "https:"), t
        }

        function i(t) {
            if (t.indexOf("youtube.com") > -1) {
                var e, i, n, a = {};
                if (1 === (o = t.split("?")).length) return;
                for (e = 0, i = (o = o[1].split("&")).length; e < i; e++) a[(n = o[e].split("="))[0]] = n[1];
                return a.v
            }
            var o;
            if (t.indexOf("youtu.be") > -1) return (o = t.split("/")).pop()
        }

        function n(t) {
            return "off" != t.attr("data-youtube-player")
        }

        function a(a) {
            a.find("a[href*='youtube.com'], a[href*='youtu.be']").each(function (a) {
                var o = t(this);
                if (n(o)) {
                    var s = i(o.attr("href"));
                    if (void 0 !== s) {
                        var r = t('<span class="media-player" />'),
                            l = o.siblings(".captions");
                        o.parent().replaceWith(r);
                        var c = e();
                        r.player({
                            id: "youtube-" + a,
                            media: s,
                            captions: l.length > 0 ? l.attr("href") : null,
                            url: c + "//www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid="
                        })
                    }
                }
            })
        }
        return {
            getProtocol: e,
            enhanceYoutubeVideoLinks: a
        }
    }
    window.GOVUK = window.GOVUK || {}, GOVUK.enhanceYoutubeVideoLinks = new e, GOVUK.enhanceYoutubeVideoLinks.enhanceYoutubeVideoLinks(t(".govuk-govspeak:not(.disable-youtube)"))
}(jQuery),
function (t) {
    var e = function () {
        this.init = function (e, i) {
            var n = {
                outOf: 65,
                applyOnInit: !0,
                toggleText: "Toggle between chart and table",
                autoOutdent: !1,
                outdentAll: !1
            };
            this.options = t.extend({}, n, i);
            var a = function () {
                var t, e = 3,
                    i = document.createElement("div"),
                    n = i.getElementsByTagName("i");
                do {
                    i.innerHTML = "<!--[if gt IE " + ++e + "]><i></i><![endif]-->"
                } while (e < 10 && n[0]);
                return e > 4 ? e : t
            }();
            return this.ENABLED = !(a && a < 8), this.$table = e, this.$graph = t("<div/>").attr("aria-hidden", "true"), this.$graph.attr("class", this.$table.attr("class")).addClass("mc-chart"), this.options.stacked = this.$table.hasClass("mc-stacked"), this.options.negative = this.$table.hasClass("mc-negative"), this.options.multiple = !this.options.stacked && (this.$table.hasClass("mc-multiple") || this.$table.find("tbody tr").first().find("td").length > 2), this.options.autoOutdent = this.options.autoOutdent || this.$table.hasClass("mc-auto-outdent"), this.options.outdentAll = this.options.outdentAll || this.$table.hasClass("mc-outdented"), this.options.multiple && this.$graph.addClass("mc-multiple"), this.options.hasCaption = !!this.$table.find("caption").length, this.ENABLED && (this.apply(), this.options.applyOnInit || this.toggle()), this
        }
    };
    e.prototype.construct = {}, e.prototype.construct.thead = function () {
        var e = t("<div />", {
                "class": "mc-thead"
            }),
            i = t("<div />", {
                "class": "mc-tr"
            }),
            n = "";
        return this.$table.find("th").each(function (e, i) {
            n += '<div class="mc-th">', n += t(i).html(), n += "</div>"
        }), i.append(n), e.append(i), e
    }, e.prototype.construct.tbody = function () {
        var e = t("<div />", {
            "class": "mc-tbody"
        });
        return this.$table.find("tbody tr").each(function (i, n) {
            var a = t("<div />", {
                    "class": "mc-tr"
                }),
                o = "";
            t(n).find("td").each(function (e, i) {
                o += '<div class="mc-td">', o += t(i).html(), o += "</div>"
            }), a.append(o), e.append(a)
        }), e
    }, e.prototype.construct.caption = function () {
        return this.$table.find("caption").clone()
    }, e.prototype.construct.toggleLink = function () {
        var e = this;
        return t("<a />", {
            href: "#",
            "class": "mc-toggle-link",
            text: this.options.toggleText
        }).on("click", function (t) {
            e.toggle(t)
        })
    }, e.prototype.constructChart = function () {
        var t = this.construct.thead.call(this),
            e = this.construct.tbody.call(this),
            i = this.construct.toggleLink.call(this);
        if (this.options.hasCaption) {
            var n = this.construct.caption.call(this);
            this.$graph.append(n)
        }
        this.$table.before(i), this.$graph.append(t), this.$graph.append(e)
    }, e.prototype.apply = function () {
        this.ENABLED && (this.constructChart(),
            this.addClassesToHeader(), this.calculateMaxWidth(), this.applyWidths(), this.insert(), this.$table.addClass("visually-hidden"), this.applyOutdent())
    }, e.prototype.toggle = function (t) {
        this.$graph.toggle(), this.$table.toggleClass("visually-hidden"), t && t.preventDefault()
    }, e.prototype.utils = {
        isFloat: function (t) {
            return !isNaN(parseFloat(t))
        },
        stripValue: function (t) {
            var e = new RegExp("\\,|\xa3|%|[a-z]", "gi");
            return t.replace(e, "")
        },
        returnMax: function (t) {
            for (var e = 0, i = 0; i < t.length; i++) t[i] > e && (e = t[i]);
            return e
        },
        isNegative: function (t) {
            return t < 0
        }
    }, e.prototype.addClassesToHeader = function () {
        var e = this.$graph.find(".mc-th").filter(":not(:first)");
        this.options.stacked && (e.last().addClass("mc-stacked-header mc-header-total"), e = e.filter(":not(:last)")), e.addClass("mc-key-header").filter(":not(.mc-stacked-header)").each(function (e, i) {
            t(i).addClass("mc-key-" + (e + 1))
        })
    }, e.prototype.calculateMaxWidth = function () {
        var e = this,
            i = [],
            n = 0;
        this.$graph.find(".mc-tr").each(function (a, o) {
            var s = t(o),
                r = s.find(".mc-td:not(:first)");
            if (e.options.stacked) {
                r.last().addClass("mc-stacked-total");
                r = r.filter(":not(:last)")
            }
            s.find(".mc-td:first").addClass("mc-key-cell");
            var l = 0;
            r.each(function (a, o) {
                var s = t(o).addClass("mc-bar-cell").addClass("mc-bar-" + (a + 1)),
                    r = e.utils.stripValue(s.text());
                if (e.utils.isFloat(r)) {
                    var c = parseFloat(r, 10),
                        d = Math.abs(c);
                    0 === c && s.addClass("mc-bar-zero"), e.options.negative && (e.utils.isNegative(c) ? (s.addClass("mc-bar-negative"), d > n && (n = d)) : s.addClass("mc-bar-positive")), c = d, e.options.stacked ? l += c : (l = c, i.push(c))
                }
            }), e.options.stacked && i.push(l)
        });
        var a = {};
        return a.max = parseFloat(e.utils.returnMax(i), 10), a.single = parseFloat(this.options.outOf / a.max, 10), this.options.negative && (a.marginLeft = parseFloat(n, 10) * a.single, a.maxNegative = parseFloat(n, 10)), a
    }, e.prototype.applyWidths = function () {
        this.dimensions = this.calculateMaxWidth();
        var e = this;
        this.$graph.find(".mc-tr").each(function (i, n) {
            var a = t(n);
            a.find(".mc-bar-cell:not(.mc-bar-zero)").length;
            a.find(".mc-bar-cell").each(function (i, n) {
                var a = t(n),
                    o = parseFloat(e.utils.stripValue(a.text()), 10),
                    s = o * e.dimensions.single,
                    r = Math.abs(o),
                    l = Math.abs(s);
                if (e.options.negative)
                    if (a.hasClass("mc-bar-positive")) a.css("margin-left", e.dimensions.marginLeft + "%");
                    else if (r < e.dimensions.maxNegative) {
                    var c = (e.dimensions.maxNegative - r) * e.dimensions.single;
                    a.css("margin-left", c + "%")
                }
                a.wrapInner("<span />"), a.css("width", l + "%")
            })
        })
    }, e.prototype.insert = function () {
        this.$table.after(this.$graph)
    }, e.prototype.applyOutdent = function () {
        var e = this;
        this.$graph.find(".mc-bar-cell");
        this.$graph.find(".mc-bar-cell").each(function (i, n) {
            var a = t(n),
                o = parseFloat(e.utils.stripValue(a.text()), 10),
                s = a.children("span"),
                r = s.width() + 10,
                l = a.width();
            parseFloat(a[0].style.width, 10), a.height();
            e.options.stacked ? r > l && o > 0 && a.addClass("mc-value-overflow") : (0 === o && a.addClass("mc-bar-outdented"), e.options.autoOutdent && r > l || e.options.outdentAll ? (a.addClass("mc-bar-outdented"), s.css({
                "margin-left": "100%",
                display: "inline-block"
            })) : a.addClass("mc-bar-indented"))
        })
    }, t.magnaCharta = function (t, i) {
        return (new e).init(t, i)
    }
}(jQuery), $(govspeakBarcharts),
    function (t) {
        "use strict";
        var e = t.jQuery,
            i = t.GOVUK || {};
        i.shimLinksWithButtonRole = {
            init: function () {
                e(document).on("keydown", '[role="button"]', function (t) {
                    32 === t.which && (t.preventDefault(), t.target.click())
                })
            }
        }, t.GOVUK = i
    }(window),
    function (t) {
        var e = t.suchi = t.suchi || {};
        e.laggards = {
            IE6: /^Mozilla\/4\.0 \(compatible; MSIE 6\.0; Windows NT \d\.\d(.*)\)$/g,
            IE7: /^Mozilla\/4\.0 \(compatible; MSIE 7\.0; Windows NT \d\.\d(.*)\)$/g,
            IE8: /^Mozilla\/4\.0 \(compatible; MSIE 8\.0; Windows NT \d\.\d;(.*)? Trident\/4\.0(;)?(.*)\)$/g,
            IE9: /^Mozilla\/5\.0 \(compatible; MSIE 9\.0; Windows NT \d\.\d(.*); Trident\/5\.0(.*)\)$/g,
            IE10: /^Mozilla\/5\.0 \(compatible; MSIE 10\.0; Windows NT \d\.\d(.*); Trident\/6\.0(.*)\)$/g,
            FF36: /^Mozilla\/5\.0 \((Windows|Macintosh); U;(.*)rv\:1\.9\.2.(\d{1,2})\)( Gecko\/(\d{8}))? Firefox\/3\.6(\.\d{1,2})?( \(.+\))?$/g,
            CR_recent: /^Mozilla\/5\.0 \((Windows NT|Macintosh|X11|(Linux; Android \d\.\d\.\d))(;)?( .*)\) AppleWebKit\/53\d\.\d{1,2} \(KHTML(,)? like Gecko\) Chrome\/(16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33)\.0\.\d{3,4}\.\d{1,3} (Mobile )?Safari\/53\d\.\d{1,2}$/g,
            FF_recent: /^Mozilla\/5\.0 \((Windows NT \d\.\d|Macintosh|Android|X11); (.*)rv\:(9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28)\.0(\.\d{1,2})?\) Gecko\/(\d{8}|(\d{2}\.0)) Firefox\/(9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28)\.0(\.\d{1,2})?$/g,
            SAF51: /^Mozilla\/5\.0 \((Windows NT \d\.\d|Macintosh)(.*)\) AppleWebKit\/534\.\d{2}(\.\d{1,2})? \(KHTML, like Gecko\) Version\/5\.1\.\d Safari\/534\.\d{2}(\.\d{1,2})?$/g,
            SAF60: /^Mozilla\/5\.0 \((iPhone|iPad|Macintosh);(.*)\) AppleWebKit\/536\.\d{2}(\.\d{1,2})? \(KHTML like Gecko\) Version\/6\.0(\.\d)? ((Mobile\/\d{2}\w\d{3} )?)Safari\/\d{2,4}\.\d{2}(\.\d{1,2})?$/g,
            ANDROID_WEBKIT: /^Mozilla\/5\.0 \(Linux;( U;)? Android 4\.(0|1|2|3|4)(\.\d)?; (.*)?\) \w{2}\-\w{2}; (.*)\) AppleWebKit\/5\d{2}.\d{2} \(KHTML like Gecko\) Version\/4\.\d Mobile Safari\/\d{3}\.\d{2}$/g
        }, e.isOld = function (t) {
            if ("string" != typeof t) return !1;
            for (var e in this.laggards)
                if (t.match(this.laggards[e])) return !0;
            return !1
        }
    }(this),
    function (t) {
        "use strict";
        var e = t.GOVUK || {};
        e.details = {
            NATIVE_DETAILS: "boolean" == typeof document.createElement("details").open,
            KEY_ENTER: 13,
            KEY_SPACE: 32,
            started: !1,
            addEvent: function (t, e, i) {
                t.addEventListener ? t.addEventListener(e, function (t) {
                    i(t, t.target)
                }, !1) : t.attachEvent && t.attachEvent("on" + e, function (t) {
                    i(t, t.srcElement)
                })
            },
            removeEvent: function (t, e) {
                t.removeEventListener ? t.removeEventListener(e, function () {}, !1) : t.detachEvent && t.detachEvent("on" + e, function () {})
            },
            charCode: function (t) {
                return "number" == typeof t.which ? t.which : t.keyCode
            },
            preventDefault: function (t) {
                t.preventDefault ? t.preventDefault() : t.returnValue = !1
            },
            addClickEvent: function (t, i) {
                e.details.addEvent(t, "keypress", function (t, n) {
                    e.details.charCode(t) !== e.details.KEY_ENTER && e.details.charCode(t) !== e.details.KEY_SPACE || "summary" === n.nodeName.toLowerCase() && (e.details.preventDefault(t), n.click ? n.click() : i(t, n))
                }), e.details.addEvent(t, "keyup", function (t, i) {
                    e.details.charCode(t) === e.details.KEY_SPACE && "SUMMARY" === i.nodeName && e.details.preventDefault(t)
                }), e.details.addEvent(t, "click", function (t, e) {
                    i(t, e)
                })
            },
            getAncestor: function (t, e) {
                do {
                    if (!t || t.nodeName.toLowerCase() === e) break;
                    t = t.parentNode
                } while (t);
                return t
            },
            addDetailsPolyfill: function (t, i) {
                if (i = i || document.body, !e.details.started && (e.details.started = !0, 0 !== (t = i.getElementsByTagName("details")).length)) {
                    for (var n = t.length, a = 0; a < n; a++) {
                        var o = t[a];
                        if (o.__summary = o.getElementsByTagName("summary").item(0), o.__content = o.getElementsByTagName("div").item(0), !o.__summary || !o.__content) return;
                        o.__content.id || (o.__content.id = "details-content-" + a), o.setAttribute("role", "group"), o.__summary.setAttribute("role", "button"), o.__summary.setAttribute("aria-controls", o.__content.id), e.details.NATIVE_DETAILS || (o.__summary.tabIndex = 0);
                        var s = null !== o.getAttribute("open");
                        if (!0 === s ? (o.__summary.setAttribute("aria-expanded", "true"), o.__content.setAttribute("aria-hidden", "false")) : (o.__summary.setAttribute("aria-expanded", "false"), o.__content.setAttribute("aria-hidden", "true"), e.details.NATIVE_DETAILS || (o.__content.style.display = "none")), o.__summary.__details = o, !e.details.NATIVE_DETAILS) {
                            var r = document.createElement("i");
                            !0 === s ? (r.className = "arrow arrow-open", r.appendChild(document.createTextNode("\u25bc"))) : (r.className = "arrow arrow-closed", r.appendChild(document.createTextNode("\u25ba"))), o.__summary.__twisty = o.__summary.insertBefore(r, o.__summary.firstChild), o.__summary.__twisty.setAttribute("aria-hidden", "true")
                        }
                    }
                    e.details.addClickEvent(i, function (t, i) {
                        return !(i = e.details.getAncestor(i, "summary")) || e.details.statechange(i)
                    })
                }
            },
            statechange: function (t) {
                var i = "true" === t.__details.__summary.getAttribute("aria-expanded"),
                    n = "true" === t.__details.__content.getAttribute("aria-hidden");
                (t.__details.__summary.setAttribute("aria-expanded", i ? "false" : "true"), t.__details.__content.setAttribute("aria-hidden", n ? "false" : "true"), e.details.NATIVE_DETAILS) || (t.__details.__content.style.display = i ? "none" : "", null !== t.__details.getAttribute("open") ? t.__details.removeAttribute("open") : t.__details.setAttribute("open", "open"));
                return t.__twisty && (t.__twisty.firstChild.nodeValue = i ? "\u25ba" : "\u25bc", t.__twisty.setAttribute("class", i ? "arrow arrow-closed" : "arrow arrow-open")), !0
            },
            destroy: function (t) {
                e.details.removeEvent(t, "click")
            },
            init: function () {
                e.details.addEvent(document, "DOMContentLoaded", e.details.addDetailsPolyfill), e.details.addEvent(window, "load", e.details.addDetailsPolyfill)
            }
        }, t.GOVUK = e
    }(window),
    function (t) {
        "use strict";
        var e = t.GOVUK || {};
        e.Modules = e.Modules || {}, e.Modules.AutoTrackEvent = function () {
            this.start = function (t) {
                var i = {
                        nonInteraction: 1
                    },
                    n = t.data("track-category"),
                    a = t.data("track-action"),
                    o = t.data("track-label"),
                    s = t.data("track-value");
                "string" == typeof o && (i.label = o), (s || 0 === s) && (i.value = s), e.analytics && e.analytics.trackEvent && e.analytics.trackEvent(n, a, i)
            }
        }, t.GOVUK = e
    }(window),
    function (t) {
        "use strict";
        var e = t.jQuery,
            i = t.GOVUK || {},
            n = function (t, i) {
                this.$el = e(t), this.$extraLinks = this.$el.find("li:not(" + i + ")"), this.$extraLinks.length > 1 && (this.addToggleLink(), this.hideExtraLinks())
            };
        n.prototype = {
            toggleText: function () {
                return this.$extraLinks.length > 1 ? "+" + this.$extraLinks.length + " others" : "+" + this.$extraLinks.length + " other"
            },
            addToggleLink: function () {
                this.$toggleLink = e('<a href="#">' + this.toggleText() + "</a>"), this.$toggleLink.click(e.proxy(this.toggleLinks, this)), this.$toggleLink.insertAfter(this.$el)
            },
            toggleLinks: function (t) {
                t.preventDefault(), this.$toggleLink.remove(), this.showExtraLinks()
            },
            hideExtraLinks: function () {
                this.$extraLinks.addClass("visuallyhidden"), e(window).trigger("govuk.pageSizeChanged")
            },
            showExtraLinks: function () {
                this.$extraLinks.removeClass("visuallyhidden"), e(window).trigger("govuk.pageSizeChanged")
            }
        }, i.PrimaryList = n, i.primaryLinks = {
            init: function (t) {
                e(t).parent().each(function (e, n) {
                    new i.PrimaryList(n, t)
                })
            }
        }, t.GOVUK = i
    }(window),
    function (t) {
        "use strict";

        function e() {
            function t(t) {
                return t.replace("[", "\\[").replace("]", "\\]")
            }

            function e() {
                var t = i(this),
                    e = n(t);
                e.length && (t.attr("aria-controls", e.attr("id")), t.attr("aria-expanded", "false"), e.attr("aria-hidden", "true"))
            }

            function n(t) {
                var e = t.attr("aria-controls");
                return e || (e = t.closest("[data-target]").data("target")), i("#" + e)
            }

            function a(t, e) {
                e.hasClass("js-hidden") && (e.removeClass("js-hidden"), e.attr("aria-hidden", "false"), t.attr("aria-controls") && t.attr("aria-expanded", "true"))
            }

            function o(t, e) {
                (e = e || n(t)).hasClass("js-hidden") || (e.addClass("js-hidden"), e.attr("aria-hidden", "true"), t.attr("aria-controls") && t.attr("aria-expanded", "false"))
            }

            function s(e, n) {
                var s = u.radio + "[name=" + t(e.attr("name")) + "][aria-controls]",
                    r = e.closest("form");
                (r.length ? r.find(s) : i(s)).each(function () {
                    o(i(this))
                }), e.is("[aria-controls]") && a(e, n)
            }

            function r(t, e) {
                t.is(":checked") ? a(t, e) : o(t, e)
            }

            function l(t, a, o, s) {
                function r() {
                    var t = i(this);
                    s(t, n(t))
                }
                t = t || i(document.body);
                var l = i(a);
                l.each(e), i.each(o, function (e, i) {
                    t.on("click." + u.namespace, i, r)
                }), l.is(":checked") && l.filter(":checked").each(r)
            }

            function c() {
                var t = [];
                return i(u.radio).map(function () {
                    var e = i(this).attr("name");
                    return -1 === i.inArray(e, t) ? (t.push(e), 'input[type="radio"][name="' + i(this).attr("name") + '"]') : null
                })
            }
            var d = this,
                u = {
                    namespace: "ShowHideContent",
                    radio: '[data-target] > input[type="radio"]',
                    checkbox: '[data-target] > input[type="checkbox"]'
                };
            d.showHideRadioToggledContent = function (t) {
                l(t, u.radio, c(), s)
            }, d.showHideCheckboxToggledContent = function (t) {
                l(t, u.checkbox, [u.checkbox], r)
            }, d.destroy = function (t) {
                (t = t || i(document.body)).off("." + u.namespace)
            }
        }
        var i = t.jQuery,
            n = t.GOVUK || {};
        e.prototype.init = function (t) {
            this.showHideRadioToggledContent(t), this.showHideCheckboxToggledContent(t)
        }, n.ShowHideContent = e, t.GOVUK = n
    }(window),
    function (t) {
        "use strict";
        var e = t.jQuery,
            i = t.GOVUK || {},
            n = {
                _hasScrolled: !1,
                _scrollTimeout: !1,
                _hasResized: !1,
                _resizeTimeout: !1,
                getWindowDimensions: function () {
                    return {
                        height: e(t).height(),
                        width: e(t).width()
                    }
                },
                getWindowPositions: function () {
                    return {
                        scrollTop: e(t).scrollTop()
                    }
                },
                getElementOffset: function (t) {
                    return t.offset()
                },
                init: function () {
                    var a = e(".js-stick-at-top-when-scrolling");
                    a.length > 0 && (n.$els = a, !1 === n._scrollTimeout && (e(t).scroll(n.onScroll), n._scrollTimeout = t.setInterval(n.checkScroll, 50)), !1 === n._resizeTimeout && (e(t).resize(n.onResize), n._resizeTimeout = t.setInterval(n.checkResize, 50))), i.stopScrollingAtFooter && a.each(function (n, a) {
                        var o = e(a).find("img");
                        if (o.length > 0) {
                            var s = new t.Image;
                            s.onload = function () {
                                i.stopScrollingAtFooter.addEl(e(a), e(a).outerHeight())
                            }, s.src = o.attr("src")
                        } else i.stopScrollingAtFooter.addEl(e(a), e(a).outerHeight())
                    })
                },
                onScroll: function () {
                    n._hasScrolled = !0
                },
                onResize: function () {
                    n._hasResized = !0
                },
                checkScroll: function () {
                    if (!0 === n._hasScrolled) {
                        n._hasScrolled = !1;
                        var t = n.getWindowPositions().scrollTop,
                            i = n.getWindowDimensions();
                        n.$els.each(function (a, o) {
                            var s = e(o),
                                r = s.data("scrolled-from");
                            r && t < r ? n.release(s) : i.width > 768 && t >= n.getElementOffset(s).top && n.stick(s)
                        })
                    }
                },
                checkResize: function () {
                    if (!0 === n._hasResized) {
                        n._hasResized = !1;
                        var t = n.getWindowDimensions();
                        n.$els.each(function (i, a) {
                            var o = e(a);
                            if (o.hasClass("js-sticky-resize")) {
                                var s = e(".shim"),
                                    r = o.parent("div").width();
                                s.css("width", r), o.css("width", r)
                            }
                            t.width <= 768 && n.release(o)
                        })
                    }
                },
                stick: function (t) {
                    if (!t.hasClass("content-fixed")) {
                        t.data("scrolled-from", n.getElementOffset(t).top);
                        var e = Math.max(t.height(), 1),
                            i = t.width();
                        t.before('<div class="shim" style="width: ' + i + "px; height: " + e + 'px">&nbsp;</div>'), t.css("width", i + "px").addClass("content-fixed")
                    }
                },
                release: function (t) {
                    t.hasClass("content-fixed") && (t.data("scrolled-from", !1), t.removeClass("content-fixed").css("width", ""), t.siblings(".shim").remove())
                }
            };
        i.stickAtTopWhenScrolling = n, t.GOVUK = i
    }(window),
    function (t) {
        "use strict";
        var e = t.jQuery,
            i = t.GOVUK || {},
            n = {
                _pollingId: null,
                _isPolling: !1,
                _hasScrollEvt: !1,
                _els: [],
                addEl: function (i, a) {
                    var o;
                    if (i.length) {
                        o = parseInt(i.css("top"), 10), o = isNaN(o) ? 0 : o, n.updateFooterTop(), e(t).on("govuk.pageSizeChanged", n.updateFooterTop);
                        var s = e("<div></div>");
                        s.insertBefore(i);
                        var r = s.offset().top - s.position().top;
                        s.remove();
                        var l = {
                            $fixedEl: i,
                            height: a + o,
                            fixedTop: a + r,
                            state: "fixed"
                        };
                        n._els.push(l), n.initTimeout()
                    }
                },
                updateFooterTop: function () {
                    var t = e(".js-footer:eq(0)");
                    if (0 === t.length) return 0;
                    n.footerTop = t.offset().top - 10
                },
                initTimeout: function () {
                    !1 === n._hasScrollEvt && (e(window).scroll(n.onScroll), n._hasScrollEvt = !0)
                },
                onScroll: function () {
                    !1 === n._isPolling && n.startPolling()
                },
                startPolling: window.requestAnimationFrame ? function () {
                    var t = function () {
                        n.checkScroll(), !0 === n._isPolling && n.startPolling()
                    };
                    n._pollingId = window.requestAnimationFrame(t), n._isPolling = !0
                } : function () {
                    n._pollingId = window.setInterval(n.checkScroll, 16), n._isPolling = !0
                },
                stopPolling: window.requestAnimationFrame ? function () {
                    window.cancelAnimationFrame(n._pollingId), n._isPolling = !1
                } : function () {
                    window.clearInterval(n._pollingId), n._isPolling = !1
                },
                checkScroll: function () {
                    var t = e(window).scrollTop();
                    t < n.cachedScrollTop + 2 && t > n.cachedScrollTop - 2 ? n.stopPolling() : (n.cachedScrollTop = t, e.each(n._els, function (e, i) {
                        t + i.height > n.footerTop ? n.stick(i) : n.unstick(i)
                    }))
                },
                stick: function (t) {
                    "fixed" === t.state && "fixed" === t.$fixedEl.css("position") && (t.$fixedEl.css({
                        position: "absolute",
                        top: n.footerTop - t.fixedTop
                    }), t.state = "absolute")
                },
                unstick: function (t) {
                    "absolute" === t.state && (t.$fixedEl.css({
                        position: "",
                        top: ""
                    }), t.state = "fixed")
                }
            };
        i.stopScrollingAtFooter = n, e(t).load(function () {
            e(t).trigger("govuk.pageSizeChanged")
        }), t.GOVUK = i
    }(window),
    function (t, e) {
        "use strict";
        var i, n = {
            uaMatch: function (t) {
                t = t.toLowerCase();
                var e = /(chrome)[ \/]([\w.]+)/.exec(t) || /(webkit)[ \/]([\w.]+)/.exec(t) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(t) || /(msie) ([\w.]+)/.exec(t) || t.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(t) || [];
                return {
                    browser: e[1] || "",
                    version: e[2] || "0"
                }
            }
        };
        (i = n.uaMatch(t.navigator.userAgent)).browser && (n[i.browser] = !0, n.version = i.version), n.webkit && (n.safari = !0), e.historyBrowserShim = n
    }(window, jQuery), jQuery.extend({
        historyCurrentHash: undefined,
        historyCallback: undefined,
        historyIframeSrc: undefined,
        historyNeedIframe: jQuery.historyBrowserShim.msie && (jQuery.historyBrowserShim.version < 8 || document.documentMode < 8),
        historyInit: function (t, e) {
            jQuery.historyCallback = t, e && (jQuery.historyIframeSrc = e);
            var i = location.hash.replace(/\?.*$/, "");
            if (jQuery.historyCurrentHash = i, jQuery.historyNeedIframe) {
                "" == jQuery.historyCurrentHash && (jQuery.historyCurrentHash = "#"), jQuery("body").prepend('<iframe id="jQuery_history" style="display: none;" src="javascript:false;"></iframe>');
                var n = jQuery("#jQuery_history")[0].contentWindow.document;
                n.open(), n.close(), n.location.hash = i
            } else jQuery.historyBrowserShim.safari && (jQuery.historyBackStack = [], jQuery.historyBackStack.length = history.length, jQuery.historyForwardStack = [], jQuery.lastHistoryLength = history.length, jQuery.isFirst = !0);
            i && jQuery.historyCallback(i.replace(/^#/, "")), setInterval(jQuery.historyCheck, 100)
        },
        historyAddHistory: function (t) {
            jQuery.historyBackStack.push(t), jQuery.historyForwardStack.length = 0, this.isFirst = !0
        },
        historyCheck: function () {
            if (jQuery.historyNeedIframe) {
                var t = jQuery("#jQuery_history")[0];
                (a = (t.contentDocument || t.contentWindow.document).location.hash.replace(/\?.*$/, "")) != jQuery.historyCurrentHash && (location.hash = a, jQuery.historyCurrentHash = a, jQuery.historyCallback(a.replace(/^#/, "")))
            } else if (jQuery.historyBrowserShim.safari) {
                if (jQuery.lastHistoryLength == history.length && jQuery.historyBackStack.length > jQuery.lastHistoryLength && jQuery.historyBackStack.shift(), !jQuery.dontCheck) {
                    var e = history.length - jQuery.historyBackStack.length;
                    if (jQuery.lastHistoryLength = history.length, e) {
                        if (jQuery.isFirst = !1, e < 0)
                            for (var i = 0; i < Math.abs(e); i++) jQuery.historyForwardStack.unshift(jQuery.historyBackStack.pop());
                        else
                            for (i = 0; i < e; i++) jQuery.historyBackStack.push(jQuery.historyForwardStack.shift());
                        var n = jQuery.historyBackStack[jQuery.historyBackStack.length - 1];
                        n != undefined && (jQuery.historyCurrentHash = location.hash.replace(/\?.*$/, ""), jQuery.historyCallback(n))
                    } else if (jQuery.historyBackStack[jQuery.historyBackStack.length - 1] == undefined && !jQuery.isFirst) {
                        if (location.hash) {
                            var a = location.hash;
                            jQuery.historyCallback(location.hash.replace(/^#/, ""))
                        } else {
                            a = "";
                            jQuery.historyCallback("")
                        }
                        jQuery.isFirst = !0
                    }
                }
            } else {
                (a = location.hash.replace(/\?.*$/, "")) != jQuery.historyCurrentHash && (jQuery.historyCurrentHash = a, jQuery.historyCallback(a.replace(/^#/, "")))
            }
        },
        historyLoad: function (t) {
            var e;
            if (t = decodeURIComponent(t.replace(/\?.*$/, "")), jQuery.historyBrowserShim.safari ? e = t : (e = "#" + t, location.hash = e), jQuery.historyCurrentHash = e, jQuery.historyNeedIframe) {
                var i = jQuery("#jQuery_history")[0].contentWindow.document;
                i.open(), i.close(), i.location.hash = e, jQuery.lastHistoryLength = history.length, jQuery.historyCallback(t)
            } else if (jQuery.historyBrowserShim.safari) {
                jQuery.dontCheck = !0, this.historyAddHistory(t);
                var n = function () {
                    jQuery.dontCheck = !1
                };
                window.setTimeout(n, 200), jQuery.historyCallback(t), location.hash = e
            } else jQuery.historyCallback(t)
        }
    }), jQuery.fn.tabs = function (t) {
        var e = $.extend({
                trackState: !0,
                srcPath: "jQuery.history.blank.html",
                autoRotate: !1,
                alwaysScrollToTop: !0,
                selected: null,
                wrapperTag: "section",
                defaultTab: null,
                containerTag: "div",
                scrollOnload: !1
            }, t),
            i = "tabset",
            n = function (t) {
                var n = i;
                return "none" === t.find("li").css("float") && (n = "accordion"), "accordion" === n ? null === e.defaultTab && (e.defaultTab = -1) : null === e.defaultTab && (e.defaultTab = 0), n
            },
            a = function (t, e) {
                return "accordion" === i ? t.find("header.js-heading-tab") : e.find("li")
            },
            o = function (t, i) {
                var n, a, o, s = i.find("li"),
                    r = i.closest(e.containerTag).parent();
                $.each(s, function () {
                    var t = $(this).find("a"),
                        i = t.attr("href").split("#")[1],
                        s = $('<a href="#' + i + '" class="tab-shiftlink">Return to top of section \u2191</a>');
                    n = r.find("#" + i), (a = (a = n.find("header")).length ? a.remove() : $("<header><h1 /></header>")).addClass("js-heading-tab").removeClass("visuallyhidden"), a.children().html("").append(t), (o = n.find(".inner")).length ? o.addClass("js-tab-pane") : o = $('<div class="inner js-tab-pane" />').html(n.html()), o.attr("id", i), n.replaceWith($("<" + e.wrapperTag + " />").append(o)), (n = o.parent()).prepend(a).attr("id", i), n.addClass("js-tab-container"), o.append(s)
                }), i.closest(e.containerTag).remove()
            };
        return $(this).each(function () {
            function t(t, n) {
                if (e.trackState && !n) {
                    var a = t.attr("href").split("#")[1];
                    $.historyLoad(a)
                } else {
                    p.find("a").attr("aria-selected", !1).attr("tabindex", -1), "accordion" === i ? p.find("a").closest(".js-heading-tab").removeClass("active") : p.find("a").parent().filter(".active").removeClass("active"), t.attr("aria-selected", !0).attr("tabindex", 0), "accordion" === i ? t.closest(".js-heading-tab").addClass("active") : t.parent().addClass("active"), d.find(".tabs-panel-selected").attr("aria-hidden", !0).attr("aria-expanded", !1).removeClass("tabs-panel-selected").hide();
                    a = t.attr("href").split("#")[1];
                    $("#" + a + h).addClass("tabs-panel-selected").attr("aria-hidden", !1).attr("aria-expanded", !0).show(), e.selected = p.find("a").index(t), l.trigger("tabChanged", a)
                }
            }

            function s() {
                p.find("a").attr("aria-selected", !1).attr("tabindex", -1), p.find("a").closest(".js-heading-tab").removeClass("active"), d.find(".tabs-panel-selected").attr("aria-hidden", !0).attr("aria-expanded", !1).removeClass("tabs-panel-selected").hide()
            }

            function r(i, n) {
                var a = i || window.location.hash;
                0 == a.indexOf("#") && (a = a.split("#")[1]);
                var o = p.find('a[href$="#' + a + '"]');
                return o.size() > 0 ? (t(o, !0), e.scrollOnload && n && window.setTimeout(function () {
                    $(document).scrollTop(o.offset().top)
                }, 0)) : e.defaultTab > -1 && t(p.find("a").eq(e.defaultTab), !0), !!o.size()
            }
            var l = $(this),
                c = l.find(".js-tabs ul, .js-tabs ol");
            if (0 === c.length) return l;
            var d = $(".js-tab-content"),
                u = "tab-",
                h = "-enhanced";
            d.addClass("tabs-body").attr("aria-live", "polite"), "accordion" === (i = n(c)) ? o(l, c) : c.addClass("tabs-nav").attr("role", "tablist"), d.find(".js-tab-pane").each(function () {
                $(this).addClass("tabs-panel").attr("role", "tabpanel").attr("aria-hidden", !0).attr("aria-expanded", !1).attr("aria-labelledby", u + $(this).attr("id")).attr("id", $(this).attr("id") + h).hide()
            });
            var p = a(d, c);
            p.find("a").each(function () {
                var t = $(this).attr("href").split("#")[1];
                $(this).attr("role", "tab").attr("id", u + t).attr("aria-controls", t).attr("aria-flowto", t)
            }), l.on("keydown", function (t) {
                if (!(t.keyCode < $.ui.keyCode.PAGE_UP || t.keyCode > $.ui.keyCode.DOWN)) {
                    var i;
                    switch (t.keyCode) {
                        case $.ui.keyCode.RIGHT:
                            t.preventDefault(), i = e.selected + 1;
                            break;
                        case $.ui.keyCode.DOWN:
                            i = e.selected + 1;
                            break;
                        case $.ui.keyCode.UP:
                        case $.ui.keyCode.LEFT:
                            i = e.selected - 1;
                            break;
                        case $.ui.keyCode.END:
                            i = p.length - 1;
                            break;
                        case $.ui.keyCode.HOME:
                            i = 0;
                            break;
                        case $.ui.keyCode.PAGE_UP:
                            if (!t.ctrlKey) return;
                            i = e.selected + 1;
                            break;
                        case $.ui.keyCode.PAGE_DOWN:
                            if (!t.ctrlKey) return;
                            if (i = e.selected + 1, !t.ctrlKey) return;
                            i = e.selected - 1
                    }
                    return t.preventDefault(), t.stopPropagation(), i !== undefined && (i = i >= p.length ? 0 : i < 0 ? p.length - 1 : i, p.find("a").eq(i).focus(), e.selected = i), !1
                }
            }), l.bind("click keydown focus", function () {
                e.autoRotate && clearInterval(tabRotator)
            }), e.trackState && $.historyInit(r, e.srcPath), r(null, !0), p.on("click", "a", function () {
                return $(this).closest(".js-heading-tab").hasClass("active") ? s($(this)) : t($(this)), $(this).focus(), !1
            }), e.alwaysScrollToTop && $(window)[0].scrollTo(0, 0), "undefined" != typeof GOVUK.stopScrollingAtFooter && GOVUK.stopScrollingAtFooter.updateFooterTop()
        })
    }, $(function () {
        "use strict";

        function t() {
            var t = $('<div id="global-browser-prompt"></div>'),
                e = $('<p><a href="/help/browsers">Upgrade your web browser</a> (the software you use to access the internet), it\u2019s out of date</p>'),
                i = $('<a href="#" class="dismiss" title="Dismiss this message">Close</a>');
            return t.append(e.append(i))
        }
        if (GOVUK.cookie("seen_cookie_message")) {
            var e = GOVUK.getCookie("TLSversion"),
                i = "TLSv1" == e || "TLSv1.1" == e,
                n = suchi.isOld(navigator.userAgent);
            if ((n || i) && null !== GOVUK.cookie("govuk_not_first_visit") && null === GOVUK.cookie("govuk_browser_upgrade_dismissed")) {
                var a = t();
                $("#global-cookie-message").after(a), a.show(), GOVUK.analytics.trackEvent("browser-check", "prompt-shown", {
                    value: 1,
                    nonInteraction: !0
                }), i && !n && GOVUK.analytics.trackEvent("browser-check", "prompt-shown-tls", {
                    value: 1,
                    nonInteraction: !0
                }), a.on("click", ".dismiss", function () {
                    a.hide(), GOVUK.cookie("govuk_browser_upgrade_dismissed", "yes", {
                        days: 28
                    })
                })
            }
            GOVUK.cookie("govuk_not_first_visit", "yes", {
                days: 28
            })
        }
    });
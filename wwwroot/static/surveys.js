! function (e) {
    "use strict";
    window.GOVUK = window.GOVUK || {};
    var t = function (e, t) {
            return "<a " + (t = t ? 'class="' + t + '"' : "") + ' href="{{surveyUrl}}" id="take-survey" target="_blank" rel="noopener noreferrer">' + e + "</a>"
        },
        r = function (e) {
            return '<section id="user-satisfaction-survey" class="visible" aria-hidden="false">  <div class="survey-wrapper">    <a class="survey-close-button" href="#user-survey-cancel" aria-labelledby="survey-title user-survey-cancel" id="user-survey-cancel" role="button">Close</a>    <h2 class="survey-title" id="survey-title">{{title}}</h2>' + e + "  </div></section>"
        },
        n = r("<p>" + t("{{surveyCta}}", "survey-primary-link") + ' <span class="postscript-cta">{{surveyCtaPostscript}}</span></p>'),
        i = r('<div id="email-survey-pre">  <a class="survey-primary-link" href="#email-survey-form" id="email-survey-open" rel="noopener noreferrer" role="button" aria-expanded="false">    {{surveyCta}}  </a></div><form id="email-survey-form" action="/contact/govuk/email-survey-signup" method="post" class="js-hidden" aria-hidden="true">  <div class="survey-inner-wrapper">    <div id="survey-form-description" class="survey-form-description">{{surveyFormDescription}}      <br> {{surveyFormCtaPostscript}}    </div>    <label class="survey-form-label" for="survey-email-address">      Email Address    </label>    <input name="email_survey_signup[survey_id]" type="hidden" value="{{surveyId}}">    <input name="email_survey_signup[survey_source]" type="hidden" value="{{surveySource}}">    <input name="email_survey_signup[ga_client_id]" type="hidden" value="{{gaClientId}}">    <input class="survey-form-input" name="email_survey_signup[email_address]" id="survey-email-address" type="text" aria-describedby="survey-form-description">    <button class="survey-form-button" type="submit">{{surveyFormCta}}</button>' + t("{{surveyFormNoEmailInvite}}") + '  </div></form><div id="email-survey-post-success" class="js-hidden" aria-hidden="true" tabindex="-1">  {{surveySuccess}}</div><div id="email-survey-post-failure" class="js-hidden" aria-hidden="true" tabindex="-1">  {{surveyFailure}}</div>'),
        a = 2,
        s = "(max-width: 800px)",
        u = function () {
            var e = window.location.pathname;
            switch (!0) {
                case /^\/correct-your-business-rates(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=VOAgov&utm_source=Other&utm_medium=gov.uk&t=HMRC&id=125";
                case /^\/guidance\/fulfilment-house-due-diligence-scheme(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=FHDDSgov&utm_source=Other&utm_medium=other&t=HMRC&id=99";
                case /^\/guidance\/soft-drinks-industry-levy(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=SoftDrinksGOV&utm_source=Other&utm_medium=other&t=HMRC&id=100";
                case /^\/guidance\/tell-hmrc-if-youve-underpaid-national-minimum-wage-in-the-social-care-sector(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=MinWageSocialCareGOV&utm_source=Other&utm_medium=other&t=HMRC&id=101";
                case /^\/child-benefit(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=ChildBenefitGOV&utm_source=Other&utm_medium=other&t=HMRC&id=26";
                case /^\/tax-overpayments-and-underpayments(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=OverpayUnderpayGOV&utm_source=Other&utm_medium=other&t=HMRC&id=27";
                case /^\/pay-tax-debit-credit-card(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=onlinepaymentsGOV&utm_source=Other&utm_medium=other&t=HMRC&id=32";
                case /^\/eori(?:\/|$)/.test(e):
                case /^\/starting-to-import(?:\/|$)/.test(e):
                case /^\/starting-to-export(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=EORIgov&utm_source=Other&utm_medium=gov.uk%20survey&t=HMRC&id=61";
                case /^\/duty-deferment-statements(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=DDESgov&utm_source=Other&utm_medium=gov.uk%20survey&t=HMRC&id=60";
                case /^\/government\/publications\/notice-101-deferring-duty-vat-and-other-charges\/notice-101-deferring-duty-vat-and-other-charges(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=DDESgov&utm_source=Other&utm_medium=gov.uk%20survey&t=HMRC&id=61";
                case /^\/government\/publications\/notice-100-customs-flexible-accounting-system\/notice-100-customs-flexible-accounting-system(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=DDESgov&utm_source=Other&utm_medium=gov.uk%20survey&t=HMRC&id=62";
                case /^\/working-tax-credit(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=workingtaxcreditGOV&utm_source=Other&utm_medium=other&t=HMRC&id=12";
                case /^\/guidance\/money-laundering-regulations-register-with-hmrc(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=MoneyLaundering RegulationsGOV&utm_source=Other&utm_medium=gov.uk%20survey&t=HMRC&id=45";
                case /^\/child-tax-credit(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=ChildTaxCreditGOV&utm_source=Other&utm_medium=gov.uk%20survey&t=HMRC&id=10";
                case /^\/check-state-pension(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=checkstatepensionGOV&utm_source=Other&utm_medium=other&t=HMRC&id=46";
                case /^\/apply-marriage-allowance(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=marriageallowanceGOV&utm_source=Other&utm_medium=other&t=HMRC&id=47";
                case /^\/stamp-duty-land-tax(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=StampDutyLandTaxGOV&utm_source=Other&utm_medium=other&t=HMRC&id=48";
                case /^\/guidance\/pay-apprenticeship-levy(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=Apprenticeship Levy&utm_source=Money_and_tax&utm_medium=gov.uk&t=HMRC&id=7";
                case /^\/update-company-car-details(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=CompanyCarGOV&utm_source=Other&utm_medium=other&t=HMRC&id=49";
                case /^\/guidance\/paying-your-employees-expenses-and-benefits-through-your-payroll(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=PayrollExpensesBenefitsGOV&utm_source=Other&utm_medium=other&t=HMRC&id=50";
                case /^\/guidance\/pension-schemes-protect-your-lifetime-allowance(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=PensionSchemeLifetimeAllowanceGOV&utm_source=Other&utm_medium=other&t=HMRC&id=51";
                case /^\/send-employment-intermediary-report(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=EmploymentIntermediaryReportGOV&utm_source=Other&utm_medium=other&t=HMRC&id=52";
                case /^\/guidance\/tell-hmrc-about-your-employment-related-securities(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=EmploymentRelatedSecuritiesGOV&utm_source=Other&utm_medium=other&t=HMRC&id=53";
                case /^\/guidance\/pension-administrators-check-a-members-gmp(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=PensionAdministratorsGMPGOV&utm_source=Other&utm_medium=other&t=HMRC&id=54";
                case /^\/simple-assessment(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=simpleassessmentGOV&utm_source=Other&utm_medium=other&t=HMRC&id=55";
                case /^\/tax-on-your-private-pension\/lifetime-allowance(?:\/|$)/.test(e):
                    return "https://signup.take-part-in-research.service.gov.uk/?utm_campaign=PrivatePensionContributionsGOV&utm_source=govukother&utm_medium=gov.uk&t=HMRC&id=105";
                default:
                    return ""
            }
        },
        o = {
            defaultSurvey: {
                url: "https://www.smartsurvey.co.uk/s/gov_uk?c={{currentPath}}",
                identifier: "user_satisfaction_survey",
                frequency: 6,
                surveyType: "email"
            },
            smallSurveys: [{
                identifier: "hmrc_february",
                surveyType: "url",
                frequency: 5,
                startTime: new Date("February 14, 2018").getTime(),
                endTime: new Date("May 14, 2018").getTime(),
                url: u(),
                templateArgs: {
                    title: "Get involved in making government services better",
                    surveyCta: "Take the 3 minute survey.",
                    surveyCtaPostscript: "This will open a short survey on another website."
                },
                activeWhen: {
                    path: ["^/correct-your-business-rates(?:/|$)", "^/guidance/fulfilment-house-due-diligence-scheme(?:/|$)", "^/guidance/soft-drinks-industry-levy(?:/|$)", "^/guidance/tell-hmrc-if-youve-underpaid-national-minimum-wage-in-the-social-care-sector(?:/|$)", "^/child-benefit(?:/|$)", "^/tax-overpayments-and-underpayments(?:/|$)", "^/pay-tax-debit-credit-card(?:/|$)", "^/eori(?:/|$)", "^/starting-to-import(?:/|$)", "^/starting-to-export(?:/|$)", "^/duty-deferment-statements(?:/|$)", "^/government/publications/notice-101-deferring-duty-vat-and-other-charges/notice-101-deferring-duty-vat-and-other-charges(?:/|$)", "^/government/publications/notice-100-customs-flexible-accounting-system/notice-100-customs-flexible-accounting-system(?:/|$)", "^/working-tax-credit(?:/|$)", "^/guidance/money-laundering-regulations-register-with-hmrc(?:/|$)", "^/child-tax-credit(?:/|$)", "^/check-state-pension(?:/|$)", "^/apply-marriage-allowance(?:/|$)", "^/stamp-duty-land-tax(?:/|$)", "^/guidance/pay-apprenticeship-levy(?:/|$)", "^/update-company-car-details(?:/|$)", "^/guidance/paying-your-employees-expenses-and-benefits-through-your-payroll(?:/|$)", "^/guidance/pension-schemes-protect-your-lifetime-allowance(?:/|$)", "^/send-employment-intermediary-report(?:/|$)", "^/guidance/tell-hmrc-about-your-employment-related-securities(?:/|$)", "^/guidance/pension-administrators-check-a-members-gmp(?:/|$)", "^/simple-assessment(?:/|$)", "^/tax-on-your-private-pension/lifetime-allowance(?:/|$)"]
                },
                allowedOnMobile: !0
            }, {
                identifier: "CTTUK_iteration_8",
                surveyType: "url",
                frequency: 3,
                startTime: new Date("March 5, 2018").getTime(),
                endTime: new Date("March 7, 2018, 14:00:00").getTime(),
                url: "https://GDSUserResearch.optimalworkshop.com/treejack/82p1e0a6-0-0-1-0-0-1?c={{currentPath}}",
                templateArgs: {
                    title: "Help us make things easier to find on GOV.UK",
                    surveyCta: "Answer 2 quick questions.",
                    surveyCtaPostscript: "This activity will open in a separate window."
                },
                activeWhen: {
                    path: ["^/browse/visas-immigration(?:/|$)", "^/call-charges$", "^/when-do-the-clocks-change$", "^/guidance/immigration-rules$"],
                    organisation: ["<OT554>", "<PB263>", "<PB275>", "<OT535>", "<OT1069>", "<EA67>", "<OT885>", "<EA66>", "<OT284>"]
                },
                allowedOnMobile: !0
            }, {
                identifier: "GOVUK_navigation_links_groups_and_labels",
                surveyType: "url",
                frequency: 3,
                startTime: new Date("March 7, 2018").getTime(),
                endTime: new Date("March 9, 2018, 23:59:59").getTime(),
                url: "https://s.userzoom.com/m/MSBDNjI1UzY5",
                templateArgs: {
                    title: "Help us make things easier to find on GOV.UK",
                    surveyCta: "Complete a quick activity",
                    surveyCtaPostscript: "This activity will open in a separate window."
                },
                activeWhen: {
                    section: ["childcare-parenting", "education"]
                },
                allowedOnMobile: !0
            }],
            init: function () {
                if (o.canShowAnySurvey()) {
                    var e = o.getActiveSurvey(o.defaultSurvey, o.smallSurveys);
                    e !== undefined && o.displaySurvey(e)
                }
            },
            canShowAnySurvey: function () {
                return !o.pathInBlacklist() && (!o.otherNotificationVisible() && (!o.userCompletedTransaction() && !(e("#user-satisfaction-survey-container").length <= 0)))
            },
            processTemplate: function (t, r) {
                return e.each(t, function (e, t) {
                    r = r.replace(new RegExp("{{" + e + "}}", "g"), t)
                }), r
            },
            getUrlSurveyTemplate: function () {
                return {
                    render: function (t) {
                        var r = {
                                title: "Tell us what you think of GOV.UK",
                                surveyCta: "Take the 3 minute survey",
                                surveyCtaPostscript: "This will open a short survey on another website",
                                surveyUrl: o.addParamsToURL(t.url)
                            },
                            i = e.extend(r, t.templateArgs);
                        return o.processTemplate(i, n)
                    }
                }
            },
            getEmailSurveyTemplate: function () {
                return {
                    render: function (t) {
                        var r = {
                                title: "Tell us what you think of GOV.UK",
                                surveyCta: "Take a short survey to give us your feedback",
                                surveyFormDescription: "We\u2019ll send you a link to a feedback form. It only takes 2 minutes to fill in.",
                                surveyFormCta: "Send me the survey",
                                surveyFormCtaPostscript: "Don\u2019t worry: we won\u2019t send you spam or share your email address with anyone.",
                                surveyFormNoEmailInvite: "Don\u2019t have an email address?",
                                surveySuccess: "Thanks, we\u2019ve sent you an email with a link to the survey.",
                                surveyFailure: "Sorry, we\u2019re unable to send you an email right now. Please try again later.",
                                surveyId: t.identifier,
                                surveySource: o.currentPath(),
                                surveyUrl: o.addParamsToURL(t.url),
                                gaClientId: GOVUK.analytics.gaClientId
                            },
                            n = e.extend(r, t.templateArgs);
                        return o.processTemplate(n, i)
                    }
                }
            },
            getActiveSurveys: function (t) {
                return e.grep(t, function (e) {
                    if (o.currentTime() >= e.startTime && o.currentTime() <= e.endTime) return o.activeWhen(e)
                })
            },
            getDisplayableSurveys: function (t) {
                return e.grep(t, function (e) {
                    return o.isSurveyToBeDisplayed(e)
                })
            },
            getActiveSurvey: function (e, t) {
                var r = o.getActiveSurveys(t),
                    n = [e].concat(r),
                    i = o.getDisplayableSurveys(n);
                return i.length < 2 ? i[0] : i[Math.floor(Math.random() * i.length)]
            },
            displaySurvey: function (t) {
                var r = e("#user-satisfaction-survey-container");
                if ("email" === t.surveyType) o.displayEmailSurvey(t, r);
                else {
                    if ("url" !== t.surveyType && t.surveyType !== undefined) return;
                    o.displayURLSurvey(t, r)
                }
                o.incrementSurveySeenCounter(t), o.trackEvent(t.identifier, "banner_shown", "Banner has been shown")
            },
            displayURLSurvey: function (e, t) {
                var r = o.getUrlSurveyTemplate();
                t.append(r.render(e)), o.setURLSurveyEventHandlers(e)
            },
            displayEmailSurvey: function (e, t) {
                var r = o.getEmailSurveyTemplate();
                t.append(r.render(e)), o.setEmailSurveyEventHandlers(e)
            },
            addParamsToURL: function (e) {
                var t = e.replace(/\{\{currentPath\}\}/g, o.currentPath());
                return -1 !== e.indexOf("?c=") ? t + "&gcl=" + GOVUK.analytics.gaClientId : t + "?gcl=" + GOVUK.analytics.gaClientId
            },
            setEmailSurveyEventHandlers: function (t) {
                var r = e("#email-survey-open"),
                    n = e("#user-survey-cancel"),
                    i = e("#email-survey-pre"),
                    a = e("#email-survey-form"),
                    s = e("#email-survey-post-success"),
                    u = e("#email-survey-post-failure"),
                    c = e("#survey-email-address");
                e("#take-survey").click(function () {
                    o.setSurveyTakenCookie(t), o.hideSurvey(t), o.trackEvent(t.identifier, "no_email_link", "User taken survey via no email link")
                }), r.click(function (e) {
                    return t.surveyExpanded = !0, o.trackEvent(t.identifier, "email_survey_open", "Email survey opened"), i.addClass("js-hidden").attr("aria-hidden", "true"), a.removeClass("js-hidden").attr("aria-hidden", "false"), c.focus(), e.stopPropagation(), !1
                }), n.click(function (e) {
                    return o.setSurveyTakenCookie(t), o.hideSurvey(t), t.surveyExpanded ? o.trackEvent(t.identifier, "email_survey_cancel", "Email survey cancelled") : o.trackEvent(t.identifier, "banner_no_thanks", "No thanks clicked"), e.stopPropagation(), !1
                }), a.submit(function (r) {
                    var n = function () {
                            a.addClass("js-hidden").attr("aria-hidden", "true"), s.removeClass("js-hidden").attr("aria-hidden", "false"), s.focus(), o.setSurveyTakenCookie(t), o.trackEvent(t.identifier, "email_survey_taken", "Email survey taken"), o.trackEvent(t.identifier, "banner_taken", "User taken survey")
                        },
                        i = function () {
                            a.addClass("js-hidden").attr("aria-hidden", "true"), u.removeClass("js-hidden").attr("aria-hidden", "false"), u.focus()
                        },
                        c = a.attr("action");
                    return /\.js$/.test(c) || (c += ".js"), e.ajax({
                        type: "POST",
                        url: c,
                        dataType: "json",
                        data: a.serialize(),
                        success: n,
                        error: i,
                        statusCode: {
                            500: i
                        }
                    }), r.stopPropagation(), !1
                })
            },
            setURLSurveyEventHandlers: function (t) {
                var r = e("#user-survey-cancel"),
                    n = e("#take-survey");
                r.click(function (e) {
                    return o.setSurveyTakenCookie(t), o.hideSurvey(t), o.trackEvent(t.identifier, "banner_no_thanks", "No thanks clicked"), e.stopPropagation(), !1
                }), n.click(function () {
                    o.setSurveyTakenCookie(t), o.hideSurvey(t), o.trackEvent(t.identifier, "banner_taken", "User taken survey")
                })
            },
            isSurveyToBeDisplayed: function (e) {
                return !(o.isBeingViewedOnMobile() && !o.surveyIsAllowedOnMobile(e)) && ("true" !== GOVUK.cookie(o.surveyTakenCookieName(e)) && (!o.surveyHasBeenSeenTooManyTimes(e) && o.randomNumberMatches(e.frequency)))
            },
            pathInBlacklist: function () {
                return new RegExp("^/(?:" + /service-manual/.source + ")(?:/|$)").test(o.currentPath())
            },
            userCompletedTransaction: function () {
                function e(e, t) {
                    return e.indexOf(t) > -1
                }
                var t = o.currentPath();
                if (e(t, "/done") || e(t, "/transaction-finished") || e(t, "/driving-transaction-finished")) return !0
            },
            trackEvent: function (e, t, r) {
                window.GOVUK.analytics.trackEvent(e, t, {
                    label: r,
                    value: 1,
                    nonInteraction: !0
                })
            },
            setSurveyTakenCookie: function (e) {
                window.GOVUK.cookie(o.surveyTakenCookieName(e), !0, {
                    days: 90
                })
            },
            incrementSurveySeenCounter: function (e) {
                var t = o.surveySeenCookieName(e),
                    r = o.surveySeenCount(e) + 1,
                    n = o.seenTooManyTimesCooloff(e);
                n ? window.GOVUK.cookie(t, r, {
                    days: n
                }) : window.GOVUK.cookie(t, r)
            },
            seenTooManyTimesCooloff: function (e) {
                return e.seenTooManyTimesCooloff ? m(e.seenTooManyTimesCooloff, undefined, 1) : undefined
            },
            hideSurvey: function () {
                e("#user-satisfaction-survey").removeClass("visible").attr("aria-hidden", "true")
            },
            randomNumberMatches: function (e) {
                return 0 === Math.floor(Math.random() * e)
            },
            otherNotificationVisible: function () {
                return e([".govuk-emergency-banner:visible", "#global-cookie-message:visible", "#global-browser-prompt:visible", "#taxonomy-survey:visible"].join(", ")).length > 0
            },
            surveyHasBeenSeenTooManyTimes: function (e) {
                return o.surveySeenCount(e) >= o.surveySeenTooManyTimesLimit(e)
            },
            surveySeenTooManyTimesLimit: function (e) {
                var t = e.seenTooManyTimesLimit;
                return "unlimited" === String(t).toLowerCase() ? Infinity : m(t, a, 1)
            },
            surveySeenCount: function (e) {
                return m(GOVUK.cookie(o.surveySeenCookieName(e)), 0, 0)
            },
            surveyTakenCookieName: function (e) {
                return c("taken_" + e.identifier)
            },
            surveySeenCookieName: function (e) {
                return c("survey_seen_" + e.identifier)
            },
            isBeingViewedOnMobile: function () {
                return window.matchMedia(s).matches
            },
            surveyIsAllowedOnMobile: function (e) {
                return e.hasOwnProperty("allowedOnMobile") && !0 === e.allowedOnMobile
            },
            pathMatch: function (t) {
                return t !== undefined && new RegExp(e.map(e.makeArray(t), function (e) {
                    return /[\^\$]/.test(e) ? "(?:" + e + ")" : "(?:/" + e + "(?:/|$))"
                }).join("|")).test(o.currentPath())
            },
            breadcrumbMatch: function (t) {
                return t !== undefined && new RegExp(e.makeArray(t).join("|"), "i").test(o.currentBreadcrumb())
            },
            sectionMatch: function (t) {
                if (t === undefined) return !1;
                var r = new RegExp(e.makeArray(t).join("|"), "i");
                return r.test(o.currentSection()) || r.test(o.currentThemes())
            },
            organisationMatch: function (t) {
                return t !== undefined && new RegExp(e.makeArray(t).join("|")).test(o.currentOrganisation())
            },
            tlsCookieMatch: function (e) {
                var t = o.currentTlsVersion();
                return e !== undefined && "" != t && t < e[0]
            },
            activeWhen: function (e) {
                if (e.hasOwnProperty("activeWhen")) {
                    if (e.activeWhen.hasOwnProperty("path") || e.activeWhen.hasOwnProperty("breadcrumb") || e.activeWhen.hasOwnProperty("section") || e.activeWhen.hasOwnProperty("organisation") || e.activeWhen.hasOwnProperty("tlsCookieVersionLimit")) {
                        var t = e.activeWhen.matchType || "include",
                            r = o.tlsCookieMatch(e.activeWhen.tlsCookieVersionLimit),
                            n = o.pathMatch(e.activeWhen.path),
                            i = o.breadcrumbMatch(e.activeWhen.breadcrumb),
                            a = o.sectionMatch(e.activeWhen.section),
                            s = o.organisationMatch(e.activeWhen.organisation),
                            u = r || n || i || a || s;
                        return "exclude" !== t ? u : !u
                    }
                    return !0
                }
                return !0
            },
            currentTime: function () {
                return (new Date).getTime()
            },
            currentPath: function () {
                return window.location.pathname
            },
            currentBreadcrumb: function () {
                return e(".govuk-breadcrumbs").text() || ""
            },
            currentSection: function () {
                return e('meta[name="govuk:section"]').attr("content") || ""
            },
            currentThemes: function () {
                return e('meta[name="govuk:themes"]').attr("content") || ""
            },
            currentOrganisation: function () {
                return e('meta[name="govuk:analytics:organisations"]').attr("content") || ""
            },
            currentTlsVersion: function () {
                var e = GOVUK.getCookie("TLSversion");
                return null == e || "unknown" == e ? "" : parseFloat(e.replace("TLSv", "")) || ""
            }
        },
        c = function (e) {
            return "govuk_" + e.replace(/(\_\w)/g, function (e) {
                return e.charAt(1).toUpperCase()
            })
        },
        m = function (e, t, r) {
            var n = parseInt(e, 10);
            return isNaN(n) || n < r ? t : n
        };
    window.GOVUK.userSurveys = o, e(document).ready(function () {
        GOVUK.userSurveys && (GOVUK.analytics && GOVUK.analytics.gaClientId ? window.GOVUK.userSurveys.init() : e(window).on("gaClientSet", function () {
            window.GOVUK.userSurveys.init()
        }))
    })
}(window.jQuery);
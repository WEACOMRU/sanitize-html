/*! htmlFormatting | © 2015 bashkos | https://github.com/WEACOMRU/html-formatting */

var
    htmlFormatting = (function () {
        'use strict';

        var
            getRule = function (node, valid_elements) {
                var re = new RegExp('(?:^|,)' + node.tagName.toLowerCase() + '(?:,|$)'),
                    rules = Object.keys(valid_elements),
                    rule = false,
                    i;

                for (i = 0; i < rules.length && !rule; i++) {
                    if (re.test(rules[i])) {
                        rule = valid_elements[rules[i]];
                    }
                }

                return rule;
            },

            convert = function (node, convert_to) {
                var parent = node.parentNode,
                    converted = document.createElement(convert_to);

                if (node.style.cssText) {
                    converted.style.cssText = node.style.cssText;
                }
                if (node.className) {
                    converted.className = node.className;
                }

                while (node.childNodes.length > 0) {
                    converted.appendChild(node.childNodes[0]);
                }

                parent.replaceChild(converted, node);
            },

            checkStyles = function (node, valid_styles) {
                var i, re;

                if (typeof valid_styles === 'string' && node.style.length) {
                    for (i = node.style.length - 1; i >= 0; i--) {
                        re = new RegExp('(?:^|,)' + node.style[i] + '(?:,|$)');

                        if (!re.test(valid_styles)) {
                            node.style[node.style[i]] = '';
                        }
                    }
                    
                    if (!node.style.cssText) {
                        node.removeAttribute('style');
                    }
                }
            },

            checkClasses = function (node, valid_classes) {
                var i, re;

                if (typeof valid_classes === 'string' && node.classList.length) {
                    for (i = node.classList.length - 1; i >= 0; i--) {
                        re = new RegExp('(?:^|\\s)' + node.classList[i] + '(?:\\s|$)');

                        if (!re.test(valid_classes)) {
                            node.classList.remove(node.classList[i]);
                        }
                    }

                    if (!node.className) {
                        node.removeAttribute('class');
                    }
                }
            },

            isEmpty = function (node) {
                var result = true,
                    re = /^\s*$/,
                    i, child;

                if (node.hasChildNodes()) {
                    for (i = 0; i < node.childNodes.length && result; i++) {
                        child = node.childNodes[i];

                        if (child.nodeType === 1) {
                            result = isEmpty(child);
                        } else if (child.nodeType === 3 && !re.test(child.nodeValue)) {
                            result = false;
                        }
                    }
                }

                return result;
            },

            unpack = function (node) {
                var parent = node.parentNode;

                while (node.childNodes.length > 0) {
                    parent.insertBefore(node.childNodes[0], node);
                }
            },

            processText = function (node) {
                node.nodeValue = node.nodeValue.replace(/\xa0/g, ' ');
            },

            processNode = function (node, valid_elements, taskSet) {
                var rule;

                if (node.nodeType === 1) {
                    rule = getRule(node, valid_elements);

                    if (rule) {
                        if (typeof rule.valid_elements === 'undefined') {
                            process(node, valid_elements);
                        } else {
                            process(node, rule.valid_elements)
                        }

                        if (rule.no_empty && isEmpty(node)) {
                            taskSet.push({
                                task: 'remove',
                                node: node
                            });
                        } else {
                            checkStyles(node, rule.valid_styles);
                            checkClasses(node, rule.valid_classes);

                            if (rule.convert_to) {
                                taskSet.push({
                                    task: 'convert',
                                    node: node,
                                    convert_to: rule.convert_to
                                });
                            } else if (node.id) {
                                node.removeAttribute('id');
                            }

                            if (typeof rule.process === 'function') {
                                taskSet.push({
                                    task: 'process',
                                    node: node,
                                    process: rule.process
                                });
                            }
                        }
                    } else {
                        process(node, valid_elements);

                        if (node.hasChildNodes()) {
                            taskSet.push({
                                task: 'unpack',
                                node: node
                            });
                        }

                        taskSet.push({
                            task: 'remove',
                            node: node
                        });
                    }
                } else if (node.nodeType === 3) {
                    processText(node);
                }
            },

            doTasks = function (taskSet) {
                var i;

                for (i = 0; i < taskSet.length; i++) {
                    switch (taskSet[i].task) {
                        case 'remove':
                            taskSet[i].node.parentNode.removeChild(taskSet[i].node);
                            break;

                        case 'convert':
                            convert(taskSet[i].node, taskSet[i].convert_to);
                            break;

                        case 'process':
                            taskSet[i].process(taskSet[i].node);
                            break;

                        case 'unpack':
                            unpack(taskSet[i].node);
                            break;
                    }
                }
            },

            process = function (node, valid_elements) {
                var taskSet = [],
                    i;

                for (i = 0; i < node.childNodes.length; i++) {
                    processNode(node.childNodes[i], valid_elements, taskSet);
                }

                doTasks(taskSet);
            };

        return process;
    })();

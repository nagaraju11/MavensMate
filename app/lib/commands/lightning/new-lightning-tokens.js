/**
 * @file Creates a new lightning event/opens the new lightning event ui
 * @author Joseph Ferraro <@joeferraro>
 */


'use strict';

var Promise           = require('bluebird');
var _                 = require('lodash');
var util              = require('../../util');
var inherits          = require('inherits');
var BaseCommand       = require('../../command');
var EditorService     = require('../../services/editor');
var LightningService  = require('../../services/lightning');
var MavensMateFile    = require('../../file').MavensMateFile;
var path              = require('path');
var RefreshDelegate   = require('../../refresh/delegate');

function Command() {
  BaseCommand.call(this, arguments);
}

inherits(Command, BaseCommand);

Command.prototype.execute = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.editorService.launchUI('lightning/tokens/new', { pid: self.getProject().id })
      .then(function() {
        resolve('Success');
      })
      .catch(function(error) {
        reject(error);
      });
  });
};

exports.command = Command;
exports.addSubCommand = function(program) {
  program
    .command('new-lightning-tokens')
    .option('--ui', 'Launches the default UI for the selected command.')
    .description('Creates new lightning tokens')
    .action(function() {
      if (this.ui) {
        program.commandExecutor.execute({
          name: this._name,
          body: { args: { ui: true } },
          editor: this.parent.editor
        });
      } else {
        var self = this;
        util.getPayload()
          .then(function(payload) {
            program.commandExecutor.execute({
              name: self._name,
              body: payload,
              editor: self.parent.editor
            });
          });
      }
    });
};
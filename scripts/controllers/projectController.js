(function(module) {
  var projectController = {};

  projectController.index = function() {
    if($('#projects section').length < 1) {
      Project.fetchAll(portfolioView.initIndexPage);
    };
    $('#projects').show().siblings().hide();
  };

  module.projectController = projectController;
})(window);

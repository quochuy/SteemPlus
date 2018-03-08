var token_md_editor_beautifier=null;
var markdownSource=null;
var preview=null;
var waitingForPreview = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.to==='md_editor_beautifier'&&request.order==='start'&&token_md_editor_beautifier==null&&window.location.href.includes('submit'))
    {
      token_md_editor_beautifier=request.token;
      startMDEditorPreview(); 
    }
    if(request.to==='md_editor_beautifier'&&request.order==='click'&&window.location.href.includes('submit'))
    {
      token_md_editor_beautifier=request.token;
      startMDEditorPreview();
    }
});

function startMDEditorPreview()
{
  if($('textarea').length > 0 && $('textarea')[0].textLength === 0)
  {
    waitingForPreview = true;
  }
  else
    waitingForPreview = false;
  console.log($('textarea').textLength == 0);

  setupPreview();
  $('.float-right.secondary').click(function(){
    bindTextArea();
  });
  bindTextArea();
  
}

function bindTextArea()
{
  if($('textarea').length === 0)
  {
    setTimeout(function(){
      bindTextArea();
    }, 1000);
  }
  
  $('textarea').bind('input propertychange', function(event){
    if(event.currentTarget.value.length === 0){
      preview.remove();
      waitingForPreview = true;
      console.log('change property 0');
      setupPreview();
    }
    else
    {
      console.log('added letter');
      waitingForPreview = false;
    }
  });
} 

function setupPreview(){
  $('.MarkdownViewer').bind('DOMSubtreeModified', function(event) {
    $('.MarkdownViewer > div')[1].innerHTML = $('.MarkdownViewer > div')[0].outerHTML;
  });

  if(waitingForPreview || $('.Preview').length === 0)
  {
      console.log('No preview (waiting==' + waitingForPreview + ' &&length==' + $('.Preview').length);
      setTimeout(function(){
        setupPreview();
      }, 200);
      return;
  }

  console.log($('.Preview'));

  // Put editor next to preview
  markdownSource=$('.Preview');
  preview = markdownSource.clone();
  preview.id = 'mypreview';
  markdownSource.hide();

  if($('.myrow').length > 0)
  {
    console.log('ici');
    preview.appendTo($('.myrow'));
  }
  else
  {
    console.log('la');
    preview.appendTo($('.column'));
    $('.column').removeClass('small-12');
    $('.column').addClass('row');
    $('.column').addClass('myrow');
    $('.column').removeClass('column');

    $('.ReplyEditor').removeClass('row');
  }
}


<c:set var="req" value="${pageContext.request}" />
<c:set var="urlBase" value="${req.scheme}://${req.serverName}:${req.localPort}${req.contextPath}" />
<script>

  const determine_group = (groups) => {
    if (groups.includes('Portal Administrators')) {
      return 'developer'
    } else if (groups.includes('Announcement Moderators')) {
      return 'moderator'
    } else if (groups.includes('Announcement Authors')) {
      return 'author'
    }
  }
  
  var is_demo = false
  var group = determine_group(`${bearer.groups}`)
  var path = '${pageContext.request.contextPath}'
  var token  = '${bearer.getEncryptedToken()}'
</script>
<link href='//fonts.googleapis.com/css?family=Arimo' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/main.css" />
<div id="notifications-admin" style="margin: -10px;">
  An Error Occurred
</div>
<script src="${pageContext.request.contextPath}/js/main.js" type="text/javascript"></script>
